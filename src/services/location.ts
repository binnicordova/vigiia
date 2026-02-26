import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {Platform} from "react-native";
import {currentLocationAtom} from "@/stores/location";
import {defaultStore} from "@/app/_layout";

const LOCATION_TASK_NAME = "app-location-tracking";
const DEFAULT_DISTANCE_INTERVAL = 10 * 4; // 40 meters

let foregroundSubscription: Location.LocationSubscription | null = null;

const updateCurrentLocation = (location: Location.LocationObject) => {
    defaultStore.set(currentLocationAtom, location.coords);
};

if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
    TaskManager.defineTask(LOCATION_TASK_NAME, async ({data, error}) => {
        if (error) {
            console.warn("Background location task failed", error.message);
            return;
        }

        const locations = (
            data as {locations?: Location.LocationObject[]} | undefined
        )?.locations;
        const latestLocation = locations?.at(-1);

        if (latestLocation) {
            updateCurrentLocation(latestLocation);
        }
    });
}

export const startLocationTracking = async () => {
    if (Platform.OS === "web") {
        return;
    }

    const foregroundPermission =
        await Location.requestForegroundPermissionsAsync();

    if (foregroundPermission.status !== "granted") {
        throw new Error("Foreground location permission not granted");
    }

    const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
    });

    updateCurrentLocation(currentPosition);

    if (!foregroundSubscription) {
        foregroundSubscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                distanceInterval: DEFAULT_DISTANCE_INTERVAL,
            },
            updateCurrentLocation
        );
    }

    const backgroundPermission =
        await Location.requestBackgroundPermissionsAsync();
    if (backgroundPermission.status !== "granted") {
        return;
    }

    const hasStarted =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (!hasStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: DEFAULT_DISTANCE_INTERVAL,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "Location tracking enabled",
                notificationBody:
                    "Your location is being updated in the background.",
            },
        });
    }
};

export const stopLocationTracking = async () => {
    foregroundSubscription?.remove();
    foregroundSubscription = null;

    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
};

export const initLocationService = async () => {
    try {
        await startLocationTracking();
    } catch (error) {
        console.warn("Location tracking could not be started", error);
    }
};
