import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import * as logger from "firebase-functions/logger";
import {onCall} from "firebase-functions/v2/https";

admin.initializeApp();

type Coordinate = {
    latitude: number;
    longitude: number;
};

type PublishRouteRequest = {
    uuid: string;
    coordinates: Coordinate[];
    distance: number;
    duration: number;
    coordinate: Coordinate;
    currentTime: number;
    pin: string;
};

type Vehicle = {
    id: string;
    photo: string;
};

type Route = {
    uuid: string;
    pin: string;
    coordinates: Coordinate[];
    distance: number;
    duration: number;
    coordinate: Coordinate;
    currentTime: number;
    createdAt: Date;
    vehicle: Vehicle;
    phone: string;
};

export const publishRoute = onCall(
    {
        maxInstances: 10,
        region: "us-central1",
        cors: true,
    },
    async (request) => {
        logger.info("publishRoute called with data:", request.data);

        const {
            uuid,
            coordinates,
            distance,
            duration,
            coordinate,
            currentTime,
            pin,
        } = request.data as PublishRouteRequest;

        if (!pin) {
            logger.error("PIN is required to publish a route.");
            return {
                success: false,
                message: "PIN is required to publish a route.",
            };
        }

        const firestore = getFirestore();
        const routeRef = firestore.collection("routes").doc(uuid);

        await routeRef.set(
            {
                uuid,
                distance,
                duration,
                currentTime,
                coordinate,
                pin,
                createdAt: new Date(),
            },
            {merge: true}
        );

        const storage = getStorage();
        const bucket = storage.bucket();
        const file = bucket.file(`routes/${uuid}.json`);

        const routeData = {
            uuid,
            coordinates,
            distance,
            duration,
            coordinate,
            currentTime,
        };

        await file.save(JSON.stringify(routeData), {
            contentType: "application/json",
        });

        await file.makePublic();

        logger.info(`Route data for ${uuid} saved to storage.`);

        return {
            success: true,
            message: `Route data for ${uuid} saved successfully.`,
        };
    }
);

type UpdateLocationRequest = {
    uuid: string;
    coordinate: Coordinate;
};

export const updateLocation = onCall(
    {
        maxInstances: 100,
        region: "us-central1",
        cors: true,
    },
    async (request) => {
        logger.info("updateLocation called with data:", request.data);
        const {uuid, coordinate} = request.data as UpdateLocationRequest;

        const firestore = getFirestore();
        const routeRef = firestore.collection("routes").doc(uuid);

        await routeRef.set(
            {
                coordinate,
                updatedAt: new Date(),
            },
            {merge: true}
        );

        logger.info(`Current location for ${uuid} updated in Firestore.`);

        return {
            success: true,
            message: `Current location for ${uuid} updated successfully.`,
        };
    }
);

type SendAlertRequest = {
    uuid: string;
    isPanic: boolean;
    coordinate: Coordinate;
};

export const sendAlert = onCall(
    {
        maxInstances: 10,
        cors: true,
        region: "us-central1",
    },
    async (request) => {
        logger.info("sendAlert called with data:", request.data);
        const {uuid, isPanic, coordinate} = request.data as SendAlertRequest;

        const firestore = getFirestore();
        const routeRef = firestore.collection("routes").doc(uuid);
        await routeRef.set(
            {
                isAlert: true,
                isPanic,
                updatedAt: new Date(),
                coordinate,
                isAlertAt: new Date(),
                isPanicAt: isPanic ? new Date() : null,
            },
            {merge: true}
        );

        logger.info(`Panic alert for ${uuid} updated in Firestore.`);

        if (isPanic) {
            const routeDoc = await routeRef.get();
            const routeData = routeDoc.data();
            const {pin} = routeData as Route;
            /* Call userPhone inmediately and ask for PIN to dismiss the alert.
                If PIN is correct, update isAlert to false and isPanic to false.
                If PIN is incorrect, keep the alert active and notify emergency contacts.
                If user doesn't answer the call for 3 times, keep the alert active and notify emergency contacts.
            */
            logger.info(`Panic alert for ${uuid} is active. PIN: ${pin}`);
        }

        return {
            success: true,
            message: `Panic alert for ${uuid} updated successfully.`,
        };
    }
);

type SendSafeRequest = {
    uuid: string;
    coordinate: Coordinate;
    pin: string;
};

export const sendSafe = onCall(
    {
        maxInstances: 10,
        cors: true,
        region: "us-central1",
    },
    async (request) => {
        logger.info("sendSafe called with data:", request.data);
        const {uuid, coordinate, pin} = request.data as SendSafeRequest;

        const firestore = getFirestore();
        const routeRef = firestore.collection("routes").doc(uuid);

        const routeDoc = await routeRef.get();
        if (!routeDoc.exists) {
            logger.error(`Route ${uuid} not found in Firestore.`);
            return {
                success: false,
                message: `Route ${uuid} not found.`,
            };
        }

        const routeData = routeDoc.data();
        if (routeData?.pin !== pin) {
            logger.error(`Invalid PIN for route ${uuid}.`);
            return {
                success: false,
                message: `Invalid PIN for route ${uuid}.`,
            };
        }

        await routeRef.set(
            {
                isSafe: true,
                updatedAt: new Date(),
                coordinate,
                safeAt: new Date(),
            },
            {merge: true}
        );

        logger.info(`Safe feedback for ${uuid} updated in Firestore.`);
        return {
            success: true,
            message: `Safe feedback for ${uuid} updated successfully.`,
        };
    }
);

type FinishRouteRequest = {
    uuid: string;
    coordinate: Coordinate;
    pin: string;
};

export const finishRoute = onCall(
    {
        maxInstances: 10,
        cors: true,
        region: "us-central1",
    },
    async (request) => {
        logger.info("finishRoute called with data:", request.data);
        const {uuid, coordinate, pin} = request.data as FinishRouteRequest;

        const firestore = getFirestore();
        const routeRef = firestore.collection("routes").doc(uuid);

        const routeDoc = await routeRef.get();
        if (!routeDoc.exists) {
            logger.error(`Route ${uuid} not found in Firestore.`);
            return {
                success: false,
                message: `Route ${uuid} not found.`,
            };
        }

        const routeData = routeDoc.data();
        if (routeData?.pin !== pin) {
            logger.error(`Invalid PIN for route ${uuid}.`);
            return {
                success: false,
                message: `Invalid PIN for route ${uuid}.`,
            };
        }

        await routeRef.set(
            {
                isFinished: true,
                coordinate,
                updatedAt: new Date(),
                finishedAt: new Date(),
            },
            {merge: true}
        );

        logger.info(`Route ${uuid} marked as finished in Firestore.`);

        return {
            success: true,
            message: `Route ${uuid} marked as finished successfully.`,
        };
    }
);
