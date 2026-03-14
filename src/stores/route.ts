import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {defaultStore} from "@/app/_layout";
import {
    finishRoute,
    publishRoute,
    sendAlert,
    sendSafe,
} from "@/services/monitoring";
import {getRoutePath} from "@/services/navigation";
import {
    calculateDistance,
    formatDistance,
    formatDuration,
} from "@/utils/measurements";
import {type Coordinate, currentLocationAtom} from "./location";
import {uuidAtom} from "./user";

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

export const routePinAtom = atomWithStorage<string | undefined>(
    "routePin",
    undefined
);

export const coordinatesAtom = atom<Coordinate[]>([]);
export const waypointsAtom = atom<RouteWaypoint[]>([]);
export const legsAtom = atom<RouteLeg[]>([]);
export const routeStepsAtom = atom<RouteStep[]>([]);
export const routeDistanceAtom = atom<number>(0);
export const routeDurationAtom = atom<number>(0);

export const originAtom = atom<Coordinate | undefined>(undefined);
export const destainAtom = atom<Coordinate | undefined>(undefined);

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

export const fetchRouteAtom = atom(null, async (get, set, pin: string) => {
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

    set(routePinAtom, pin);
    const uuid = await get(uuidAtom);
    if (!uuid) return;

    publishRoute({
        uuid,
        coordinates: route.coordinates,
        distance: route.distance,
        duration: route.duration,
        coordinate: get(currentLocationAtom) as Coordinate,
        currentTime: Date.now(),
        pin: pin,
    });
});

export const resetRouteAtom = atom(null, async (get, set, pin: string) => {
    const storedPin = await get(routePinAtom);
    console.log("Resetting route with pin:", pin, "Stored pin:", storedPin);
    if (pin !== storedPin) {
        throw new Error("Invalid PIN");
    }

    const uuid = await get(uuidAtom);
    if (uuid) {
        await finishRoute({
            uuid,
            coordinate: get(currentLocationAtom) as Coordinate,
            pin,
        });
    }

    set(coordinatesAtom, []);
    set(routeDistanceAtom, 0);
    set(routeDurationAtom, 0);
    set(legsAtom, []);
    set(routeStepsAtom, []);
    set(waypointsAtom, []);
    set(originAtom, get(currentLocationAtom));
    set(destainAtom, get(currentLocationAtom));
});

export const sendPanic = async () => {
    const currentLocation = defaultStore.get(currentLocationAtom);
    if (!currentLocation) return;

    const uuid = await defaultStore.get(uuidAtom);
    if (!uuid) return;

    await sendAlert({
        uuid,
        isPanic: true,
        coordinate: currentLocation,
    });
};

export const imSafe = async (pin: string) => {
    const currentLocation = defaultStore.get(currentLocationAtom);
    if (!currentLocation) return;

    const storedPin = await defaultStore.get(routePinAtom);
    if (pin !== storedPin) {
        throw new Error("Invalid PIN");
    }

    const uuid = await defaultStore.get(uuidAtom);
    if (!uuid) return;

    await sendSafe({
        uuid,
        coordinate: currentLocation,
        pin,
    });
};
