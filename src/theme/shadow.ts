import {ELEVATION} from "./elevation";

export const SHADOW = {
    none: {
        shadowColor: "transparent",
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: ELEVATION[0],
    },
    small: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: ELEVATION[1],
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: ELEVATION[4],
    },
    large: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: ELEVATION[5],
    },
    extraLarge: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: ELEVATION[6],
    },
};

export type ShadowType = keyof typeof SHADOW;

export const SHADOW_LEVELS = [
    SHADOW.none,
    SHADOW.small,
    SHADOW.medium,
    SHADOW.large,
    SHADOW.extraLarge,
];
