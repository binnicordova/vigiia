import {atom} from "jotai";

export type TravelState = "idle" | "on-road" | "on-road-alert" | "finished";

export const travelStateAtom = atom<TravelState>("idle");
