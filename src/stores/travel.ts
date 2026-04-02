import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {sendAlert} from "@/services/monitoring";
import {storage} from "@/utils/storage";
import {currentLocationAtom} from "./location";
import {uuidAtom} from "./user";

export type TravelState = "idle" | "on-road" | "on-road-alert" | "finished";

const travelState = atomWithStorage<TravelState>(
    "travel-state",
    "idle",
    storage,
    {
        getOnInit: true,
    }
);

export const travelStateAtom = atom(
    async (get) => {
        const response = await get(travelState);
        console.log("Reading travelStateAtom", response);
        return response;
    },
    async (get, set, newState: TravelState) => {
        console.log("Updating travelStateAtom", newState);
        const currentState = await get(travelState);
        if (currentState === newState) {
            console.log(
                "Travel state is already",
                newState,
                "No update needed."
            );
            return;
        }

        if (newState === "on-road-alert") {
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

        console.log("Travel state changed from", currentState, "to", newState);
        set(travelState, newState);
    }
);
