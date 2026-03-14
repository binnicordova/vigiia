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

        get(uuidAtom).then((uuid) => {
            if (uuid) {
                updateLocation({
                    uuid,
                    coordinate: newLocation,
                    isAlert: nextTravelState === "on-road-alert",
                });
            }
        });
    }
);
