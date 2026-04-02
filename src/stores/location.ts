import {atom} from "jotai";
import {updateLocation} from "@/services/monitoring";
import {travelStateAtom} from "@/stores/travel";
import {getTravelStateFromCurrentLocation} from "@/utils/locationChecker";
import {coordinatesAtom, destainAtom, originAtom} from "./route";
import {uuidAtom} from "./user";

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

export const currentAtom = atom<Coordinate | undefined>(undefined);

export const currentLocationAtom = atom(
    (get) => get(currentAtom),
    async (get, set, newLocation: Coordinate) => {
        set(currentAtom, newLocation);

        const travelState = await get(travelStateAtom);
        const origin = await get(originAtom);
        const destain = await get(destainAtom);

        if (travelState === "idle") {
            console.log("Setting origin to current location:", newLocation);
            set(originAtom, newLocation);
            if (!destain) {
                console.log(
                    "Setting destain to current location in idle state:",
                    newLocation
                );
                set(destainAtom, newLocation);
            }
        }

        if (travelState === "idle" || !origin || !destain) {
            return;
        }

        const routeCoordinates = await get(coordinatesAtom);
        const routeLine = [origin, ...routeCoordinates, destain];

        const nextTravelState = getTravelStateFromCurrentLocation(
            travelState,
            newLocation,
            routeLine
        );

        if (nextTravelState !== travelState) {
            set(travelStateAtom, nextTravelState);
        }

        const uuid = await get(uuidAtom);
        if (uuid) {
            updateLocation({
                uuid,
                coordinate: newLocation,
                isAlert: nextTravelState === "on-road-alert",
            });
        }
    }
);
