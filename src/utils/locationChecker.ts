import type {Coordinate} from "@/stores/location";
import type {TravelState} from "@/stores/travel";

const OFF_ROUTE_THRESHOLD_METERS = 40; // Threshold distance in meters to consider the user off-route
const EARTH_RADIUS = 6378137;

const distanceToSegment = (
    point: Coordinate,
    segmentStart: Coordinate,
    segmentEnd: Coordinate
): number => {
    const metersPerDegreeLatitude = 111320;
    const metersPerDegreeLongitude =
        111320 * Math.cos((point.latitude * Math.PI) / 180);

    const pointX = point.longitude * metersPerDegreeLongitude;
    const pointY = point.latitude * metersPerDegreeLatitude;
    const startX = segmentStart.longitude * metersPerDegreeLongitude;
    const startY = segmentStart.latitude * metersPerDegreeLatitude;
    const endX = segmentEnd.longitude * metersPerDegreeLongitude;
    const endY = segmentEnd.latitude * metersPerDegreeLatitude;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const segmentSquaredLength = deltaX * deltaX + deltaY * deltaY;

    if (segmentSquaredLength === 0) {
        return Math.sqrt(
            (pointX - startX) * (pointX - startX) +
                (pointY - startY) * (pointY - startY)
        );
    }

    const projection =
        ((pointX - startX) * deltaX + (pointY - startY) * deltaY) /
        segmentSquaredLength;
    const clampedProjection = Math.max(0, Math.min(1, projection));

    const closestX = startX + clampedProjection * deltaX;
    const closestY = startY + clampedProjection * deltaY;

    return Math.sqrt(
        (pointX - closestX) * (pointX - closestX) +
            (pointY - closestY) * (pointY - closestY)
    );
};

const isLocationFollowingRoute = (
    location: Coordinate,
    routeLine: Coordinate[]
): boolean => {
    if (routeLine.length < 2) {
        return true;
    }

    for (let index = 0; index < routeLine.length - 1; index++) {
        const start = routeLine[index];
        const end = routeLine[index + 1];

        if (
            distanceToSegment(location, start, end) <=
            OFF_ROUTE_THRESHOLD_METERS
        ) {
            return true;
        }
    }

    return false;
};

export const getTravelStateFromCurrentLocation = (
    currentTravelState: TravelState,
    currentLocation: Coordinate,
    routeLine: Coordinate[]
): TravelState => {
    if (
        currentTravelState !== "on-road" &&
        currentTravelState !== "on-road-alert"
    ) {
        return currentTravelState;
    }

    const isOnRoute = isLocationFollowingRoute(currentLocation, routeLine);

    if (!isOnRoute && currentTravelState === "on-road") {
        return "on-road-alert";
    }

    if (isOnRoute && currentTravelState === "on-road-alert") {
        return "on-road";
    }

    return currentTravelState;
};

const toRadians = (degrees: number) => {
    return (degrees * Math.PI) / 180;
};

const toDegrees = (radians: number) => {
    return (radians * 180) / Math.PI;
};

export const calculateBearing = (
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number
) => {
    const fromLatitude = toRadians(startLatitude);
    const fromLongitude = toRadians(startLongitude);
    const toLatitude = toRadians(endLatitude);
    const toLongitude = toRadians(endLongitude);

    const deltaLongitude = toLongitude - fromLongitude;
    const y = Math.sin(deltaLongitude) * Math.cos(toLatitude);
    const x =
        Math.cos(fromLatitude) * Math.sin(toLatitude) -
        Math.sin(fromLatitude) *
            Math.cos(toLatitude) *
            Math.cos(deltaLongitude);

    return (toDegrees(Math.atan2(y, x)) + 360) % 360;
};

export const projectCoordinate = (
    latitude: number,
    longitude: number,
    distanceMeters: number,
    headingDegrees: number
) => {
    const angularDistance = distanceMeters / EARTH_RADIUS;
    const headingRadians = toRadians(headingDegrees);

    const latitudeRadians = toRadians(latitude);
    const longitudeRadians = toRadians(longitude);

    const projectedLatitude = Math.asin(
        Math.sin(latitudeRadians) * Math.cos(angularDistance) +
            Math.cos(latitudeRadians) *
                Math.sin(angularDistance) *
                Math.cos(headingRadians)
    );

    const projectedLongitude =
        longitudeRadians +
        Math.atan2(
            Math.sin(headingRadians) *
                Math.sin(angularDistance) *
                Math.cos(latitudeRadians),
            Math.cos(angularDistance) -
                Math.sin(latitudeRadians) * Math.sin(projectedLatitude)
        );

    return {
        latitude: toDegrees(projectedLatitude),
        longitude: toDegrees(projectedLongitude),
    };
};
