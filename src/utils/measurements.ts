import {STRINGS} from "@/constants/strings";
import {METRICS} from "@/constants/metrics";

export const formatDistance = (meters: number): string => {
    if (meters < METRICS.distance.threshold_km) {
        return `${Math.round(meters)} ${STRINGS.units.meters}`;
    }
    const km = meters / METRICS.distance.meters_in_km;
    return `${km.toFixed(1)} ${STRINGS.units.kilometers}`;
};

export const formatDuration = (seconds: number): string => {
    if (seconds < METRICS.duration.threshold_min) {
        return `${Math.round(seconds)} ${STRINGS.units.seconds}`;
    }

    if (seconds < METRICS.duration.threshold_hour) {
        const minutes = Math.round(
            seconds / METRICS.duration.seconds_in_minute
        );
        return `${minutes} ${STRINGS.units.minutes}`;
    }

    const hours = seconds / METRICS.duration.seconds_in_hour;
    return `${hours.toFixed(1)} ${STRINGS.units.hours}`;
};

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const METERS_PER_DEGREE = 111139;
    return (
        Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) * METERS_PER_DEGREE
    );
};
