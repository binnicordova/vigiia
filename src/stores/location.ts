import {atom} from "jotai";
import {getRoutePath} from "@/services/navigation";
import {getTravelStateFromCurrentLocation} from "@/utils/locationChecker";
import {travelStateAtom} from "@/stores/travel";
import {
    calculateDistance,
    formatDistance,
    formatDuration,
} from "@/utils/measurements";

export interface Coordinate {
    latitude: number;
    longitude: number;
    heading?: number | null;
    altitude?: number | null;
    accuracy?: number | null;
    altitudeAccuracy?: number | null;
    speed?: number | null;
    name?: string;
    distance?: number;
}

export type RouteWaypoint = {
    coordinate?: Coordinate;
    name?: string;
    distance: number;
    hint?: string;
};

export type RouteLeg = {
    distance: number;
    duration: number;
    summary?: string;
};

export type RouteStep = {
    distance: number;
    duration: number;
    name?: string;
    mode?: string;
    maneuver: {
        coordinate?: Coordinate;
        type?: string;
        modifier?: string;
        instruction?: string;
    };
};

export const originAtom = atom<Coordinate | undefined>(undefined);
export const destainAtom = atom<Coordinate | undefined>(undefined);
export const currentAtom = atom<Coordinate | undefined>(undefined);

export const currentLocationAtom = atom(
    (get) => get(currentAtom),
    (get, set, newLocation: Coordinate) => {
        console.log("Updating currentLocationAtom", newLocation);
        set(currentAtom, newLocation);

        const travelState = get(travelStateAtom);
        const origin = get(originAtom);
        const destain = get(destainAtom);

        travelState === "idle" && set(originAtom, newLocation);
        if (travelState === "idle" && destain === undefined) {
            console.log(
                "Setting destain to current location in idle state",
                newLocation
            );
            set(destainAtom, newLocation);
        }

        if (travelState === "idle" || !origin || !destain) {
            return;
        }
        const routeCoordinates = get(coordinatesAtom);
        const routeLine = [origin, ...routeCoordinates, destain];

        const nextTravelState = getTravelStateFromCurrentLocation(
            travelState,
            newLocation,
            routeLine
        );

        if (nextTravelState !== travelState) {
            set(travelStateAtom, nextTravelState);
        }
    }
);

export const coordinatesAtom = atom<Coordinate[]>([]);
export const waypointsAtom = atom<RouteWaypoint[]>([]);
export const legsAtom = atom<RouteLeg[]>([]);
export const routeStepsAtom = atom<RouteStep[]>([]);
export const routeDistanceAtom = atom<number>(0);
export const routeDurationAtom = atom<number>(0);

const NEAR_ORIGIN_THRESHOLD = 200;
export const isNearOriginAtom = atom((get) => {
    const currentLocation = get(currentLocationAtom);
    const origin = get(originAtom);

    if (!currentLocation || !origin) {
        return false;
    }

    const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        origin.latitude,
        origin.longitude
    );

    return distance <= NEAR_ORIGIN_THRESHOLD;
});

const NEAR_DESTAIN_THRESHOLD = 200;
export const isNearDestainAtom = atom((get) => {
    const currentLocation = get(currentLocationAtom);
    const destain = get(destainAtom);

    if (!currentLocation || !destain) {
        return false;
    }

    const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        destain.latitude,
        destain.longitude
    );

    return distance <= NEAR_DESTAIN_THRESHOLD;
});

export const formattedDistanceAtom = atom((get) => {
    const distance = get(routeDistanceAtom);
    return formatDistance(distance);
});

export const formattedDurationAtom = atom((get) => {
    const duration = get(routeDurationAtom);
    return formatDuration(duration);
});

export const fetchRouteAtom = atom(null, async (get, set) => {
    const origin = get(originAtom);
    const destain = get(destainAtom);

    if (!origin || !destain)
        throw new Error("Origin and destain must be defined to fetch route");

    const route = await getRoutePath(origin, destain);

    set(coordinatesAtom, route.coordinates);
    set(routeDistanceAtom, route.distance);
    set(routeDurationAtom, route.duration);
    set(legsAtom, route.legs);
    set(routeStepsAtom, route.steps);
    set(waypointsAtom, route.waypoints);

    set(originAtom, {
        latitude: route.origin.coordinate?.latitude ?? origin.latitude,
        longitude: route.origin.coordinate?.longitude ?? origin.longitude,
        name: route.origin.name,
        distance: route.origin.distance,
    });

    set(destainAtom, {
        latitude: route.destain.coordinate?.latitude ?? destain.latitude,
        longitude: route.destain.coordinate?.longitude ?? destain.longitude,
        name: route.destain.name,
        distance: route.destain.distance,
    });
});

export const resetRouteAtom = atom(null, (get, set) => {
    set(coordinatesAtom, []);
    set(routeDistanceAtom, 0);
    set(routeDurationAtom, 0);
    set(legsAtom, []);
    set(routeStepsAtom, []);
    set(waypointsAtom, []);
    set(originAtom, get(currentLocationAtom));
    set(destainAtom, get(currentLocationAtom));
});
