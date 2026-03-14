import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import uuid from "react-native-uuid";
import {defaultStore} from "@/app/_layout";

const uuidAtomWithStorage = atomWithStorage<string | undefined>(
    "user-uuid",
    undefined
);

export const uuidAtom = atom(
    async (get) => await get(uuidAtomWithStorage),
    async (get, set) => {
        const currentUuid = await get(uuidAtomWithStorage);
        if (currentUuid) {
            return;
        }
        const newUuid = uuid.v4() as string;
        await set(uuidAtomWithStorage, newUuid);
    }
);

export const InitUserThunk = () => {
    defaultStore.set(uuidAtom);
};
