import "dotenv/config";
import type {ExpoConfig} from "@expo/config-types";

const EAS_OWNER = process.env.EAS_OWNER;
const EAS_SLUG = "vigiia";
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID;

const VERSION = "0.0.3";

const APP_VARIANTS = {
    development: {
        identifier: "com.vigiia.dev",
        name: "Vigiia (Dev)",
        scheme: "dev.vigiia.com",
    },
    preview: {
        identifier: "com.vigiia.preview",
        name: "Vigiia (Preview)",
        scheme: "preview.vigiia.com",
    },
    production: {
        identifier: "com.vigiia",
        name: "Vigiia",
        scheme: "vigiia.com",
    },
};

const getAppVariant = () => {
    if (process.env.APP_VARIANT === "development")
        return APP_VARIANTS.development;
    if (process.env.APP_VARIANT === "preview") return APP_VARIANTS.preview;
    return APP_VARIANTS.production;
};

const getUniqueIdentifier = () => getAppVariant().identifier;
const getAppName = () => getAppVariant().name;
const getScheme = () => getAppVariant().scheme;

export default ({config}: {config: ExpoConfig}): ExpoConfig => ({
    ...config,
    name: getAppName(),
    scheme: getScheme(),
    slug: EAS_SLUG,
    version: VERSION,
    orientation: "portrait",
    icon: "./assets/icon.png",
    newArchEnabled: true,
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    updates: {
        url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
        fallbackToCacheTimeout: 0,
        enabled: true,
        checkAutomatically: "ON_LOAD",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        bundleIdentifier: getUniqueIdentifier(),
        infoPlist: {
            UIBackgroundModes: ["process"],
            ITSAppUsesNonExemptEncryption: false,
        },
        config: {
            googleMapsApiKey: process.env.EXPO_PUBLIC_MAPS_SECRET,
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#FFFFFF",
        },
        package: getUniqueIdentifier(),
        config: {
            googleMaps: {
                apiKey: process.env.EXPO_PUBLIC_MAPS_SECRET,
            },
        },
    },
    web: {
        favicon: "./assets/favicon.png",
        bundler: "metro",
    },
    extra: {
        router: {
            root: "src/app",
        },
        eas: {
            projectId: EAS_PROJECT_ID,
        },
    },
    owner: EAS_OWNER,
    runtimeVersion: VERSION,
    userInterfaceStyle: "automatic",
    plugins: [
        [
            "expo-router",
            {
                root: "src/app",
            },
        ],
        [
            "expo-notifications",
            {
                icon: "./assets/images/notification_icon.png",
                color: "#ffffff",
                defaultChannel: "default",
                sounds: ["./assets/sounds/notification_sound.wav"],
                enableBackgroundRemoteNotifications: true,
            },
        ],
        "expo-updates",
        "expo-background-task",
    ],
});
