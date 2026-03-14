import {atom} from "jotai";
import {sendAlert} from "@/services/monitoring";
import {currentLocationAtom} from "./location";
import {uuidAtom} from "./user";

export type TravelState = "idle" | "on-road" | "on-road-alert" | "finished";

const travelState = atom<TravelState>("idle");

export const travelStateAtom = atom(
    (get) => get(travelState),
    (get, set, newState: TravelState) => {
        console.log("Updating travelStateAtom", newState);
        set(travelState, (current) => {
            console.log(
                "Current travelState:",
                current,
                "New travelState:",
                newState
            );
            if (current !== newState && newState === "on-road-alert") {
                console.log(
                    "Travel state changed from",
                    current,
                    "to",
                    newState
                );
                const currentLocation = get(currentLocationAtom);
                get(uuidAtom).then((uuid) => {
                    if (uuid && currentLocation) {
                        sendAlert({
                            uuid,
                            coordinate: currentLocation,
                        });
                    }
                });
            }
            return newState;
        });
    }
);
