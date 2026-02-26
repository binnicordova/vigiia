import type {Coordinate} from "@/stores/location";
import {http} from "@/services/http";

type OsrmRouteResponse = {
    code?: string;
    message?: string;
    waypoints?: {
        hint?: string;
        distance?: number;
        name?: string;
        location?: [number, number];
    }[];
    routes?: {
        distance?: number;
        duration?: number;
        weight?: number;
        weight_name?: string;
        legs?: {
            distance?: number;
            duration?: number;
            summary?: string;
            steps?: {
                distance?: number;
                duration?: number;
                name?: string;
                mode?: string;
                maneuver?: {
                    location?: [number, number];
                    type?: string;
                    modifier?: string;
                    instruction?: string;
                };
            }[];
        }[];
        geometry?: {
            coordinates?: [number, number][];
        };
    }[];
};

export type RoutePathResponse = {
    code: string;
    message?: string;
    coordinates: Coordinate[];
    distance: number;
    duration: number;
    weight: number;
    weightName?: string;
    legs: {
        distance: number;
        duration: number;
        summary?: string;
    }[];
    steps: {
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
    }[];
    origin: {
        name?: string;
        distance: number;
        coordinate?: Coordinate;
    };
    destain: {
        name?: string;
        distance: number;
        coordinate?: Coordinate;
    };
    waypoints: {
        hint?: string;
        distance: number;
        name?: string;
        coordinate?: Coordinate;
    }[];
};

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export async function getRoutePath(
    origin: Coordinate,
    destain: Coordinate
): Promise<RoutePathResponse> {
    const coordinates = `${origin.longitude},${origin.latitude};${destain.longitude},${destain.latitude}`;
    const url = `${OSRM_BASE_URL}/${coordinates}?overview=full&geometries=geojson&steps=true`;

    const data = await http.get<OsrmRouteResponse>(url);
    const route = data.routes?.[0];
    const routeCoordinates = route?.geometry?.coordinates;

    if (!routeCoordinates || routeCoordinates.length === 0) {
        throw new Error("Route path not found");
    }

    const toCoordinate = (
        coordinate?: [number, number]
    ): Coordinate | undefined => {
        if (!coordinate) {
            return undefined;
        }

        const [longitude, latitude] = coordinate;
        return {latitude, longitude};
    };

    const waypoints = (data.waypoints ?? []).map((waypoint) => ({
        hint: waypoint.hint,
        distance: waypoint.distance ?? 0,
        name: waypoint.name,
        coordinate: toCoordinate(waypoint.location),
    }));

    const steps = (route.legs ?? []).flatMap((leg) =>
        (leg.steps ?? []).map((step) => ({
            distance: step.distance ?? 0,
            duration: step.duration ?? 0,
            name: step.name,
            mode: step.mode,
            maneuver: {
                coordinate: toCoordinate(step.maneuver?.location),
                type: step.maneuver?.type,
                modifier: step.maneuver?.modifier,
                instruction: step.maneuver?.instruction,
            },
        }))
    );

    return {
        code: data.code ?? "Unknown",
        message: data.message,
        coordinates: routeCoordinates.map(([longitude, latitude]) => ({
            latitude,
            longitude,
        })),
        distance: route.distance ?? 0,
        duration: route.duration ?? 0,
        weight: route.weight ?? 0,
        weightName: route.weight_name,
        legs: (route.legs ?? []).map((leg) => ({
            distance: leg.distance ?? 0,
            duration: leg.duration ?? 0,
            summary: leg.summary,
        })),
        steps,
        origin: {
            name: waypoints[0]?.name ?? waypoints[0]?.hint,
            distance: waypoints[0]?.distance ?? 0,
            coordinate: waypoints[0]?.coordinate,
        },
        destain: {
            name: waypoints[1]?.name ?? waypoints[1]?.hint,
            distance: waypoints[1]?.distance ?? 0,
            coordinate: waypoints[1]?.coordinate,
        },
        waypoints,
    };
}
