import {fetch} from "expo/fetch";
import {doc, setDoc} from "firebase/firestore";
import type {Coordinate} from "@/stores/location";
import {db} from "./firebase";

const PUBLISH_ROUTE_SERVICE_URL =
    "https://publishroute-sorfw4wcla-uc.a.run.app";
const _UPDATE_LOCATION_SERVICE_URL =
    "https://updatelocation-sorfw4wcla-uc.a.run.app";
const ALERT_SERVICE_URL = "https://sendalert-sorfw4wcla-uc.a.run.app";
const SAFE_SERVICE_URL = "https://sendsafe-sorfw4wcla-uc.a.run.app";
const FINISH_ROUTE_SERVICE_URL = "https://finishroute-sorfw4wcla-uc.a.run.app";

const FIRESTORE_COLLECTION_NAME = "routes";

const TAG = "[MONITORING SERVICE]";

export const publishRoute = (data: {
    uuid: string;
    coordinates: Coordinate[];
    distance: number;
    duration: number;
    coordinate: Coordinate;
    currentTime: number;
    pin: string;
    token: string;
}) => {
    console.log(TAG, "Publishing route with data:", data);
    return fetch(PUBLISH_ROUTE_SERVICE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({data}),
    });
};

export const updateLocation = (data: {
    uuid: string;
    coordinate: Coordinate;
    isAlert?: boolean;
}) => {
    const plateDocRef = doc(db, FIRESTORE_COLLECTION_NAME, data.uuid);
    const document = {
        ...data,
        uploadedAt: Date.now(),
    };
    setDoc(plateDocRef, document, {merge: true});
};

export const sendAlert = (data: {
    uuid: string;
    isPanic?: boolean;
    coordinate: Coordinate;
}) =>
    fetch(ALERT_SERVICE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({data}),
    });

export const sendSafe = (data: {
    uuid: string;
    coordinate: Coordinate;
    pin: string;
}) =>
    fetch(SAFE_SERVICE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({data}),
    });

export const finishRoute = async (data: {
    uuid: string;
    coordinate: Coordinate;
    pin: string;
    token: string;
}): Promise<boolean> => {
    console.log(TAG, "Finishing route with data:", data);
    const response = await fetch(FINISH_ROUTE_SERVICE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({data}),
    });
    const {result} = await response.json();
    console.log(TAG, "Finish route response:", result);
    return result.success;
};
