import "react-native-gesture-handler/jestSetup";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock Jotai
jest.mock("jotai", () => {
    const originalModule = jest.requireActual("jotai");
    const mockStore = {
        get: jest.fn(),
        set: jest.fn(),
        sub: jest.fn(),
    };
    return {
        ...originalModule,
        getDefaultStore: () => mockStore,
        createStore: () => mockStore,
        useAtom: jest.fn(),
        useAtomValue: jest.fn(),
        useSetAtom: jest.fn(),
    };
});

// Create a global mock for getDefaultStore since it's used in module scope
const jotai = require("jotai");
(global as typeof globalThis & {getDefaultStore: unknown}).getDefaultStore =
    jotai.getDefaultStore;

// Mock Jotai Utils
jest.mock("jotai/utils", () => {
    const originalModule = jest.requireActual("jotai/utils");
    return {
        ...originalModule,
        useHydrateAtoms: jest.fn(),
        atomWithStorage: (_key: string, initialValue: unknown) => {
            const {atom} = require("jotai");
            return atom(initialValue);
        },
    };
});

// Mock firebase/firestore and firebase/app
jest.mock("firebase/app", () => ({
    initializeApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    collection: jest.fn(),
    onSnapshot: jest.fn(),
}));

// Mock expo/fetch to avoid Super expression must either be null or a function
jest.mock("expo/fetch", () => ({
    fetch: jest.fn(),
    Request: jest.fn(),
    Response: jest.fn(),
    Headers: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
    Slot: "Slot",
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useSegments: () => [],
    usePathname: () => "/",
    useLocalSearchParams: () => ({}),
    Link: "Link",
    Tabs: "Tabs",
    Stack: "Stack",
    SplashScreen: {
        preventAutoHideAsync: jest.fn(),
        hideAsync: jest.fn(),
    },
}));

// Mock expo-constants
jest.mock("expo-constants", () => ({
    expoConfig: {
        extra: {
            eas: {
                projectId: "test-project-id",
            },
        },
    },
}));

// Mock expo-font
jest.mock("expo-font", () => ({
    useFonts: () => [true, null],
    loadAsync: jest.fn(),
    isLoaded: jest.fn(() => true),
}));

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
    preventAutoHideAsync: jest.fn(),
    hideAsync: jest.fn(),
}));

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
    addPushTokenListener: jest.fn(),
    removeNotificationSubscription: jest.fn(),
    setNotificationHandler: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    getPermissionsAsync: jest.fn(),
    addNotificationReceivedListener: jest.fn(),
    addNotificationResponseReceivedListener: jest.fn(),
    cancelAllScheduledNotificationsAsync: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
    AndroidImportance: {
        MAX: 5,
        HIGH: 4,
        DEFAULT: 3,
        LOW: 2,
        MIN: 1,
        NONE: 0,
    },
}));

// Fix for fetch issues in Node environment
if (typeof fetch === "undefined") {
    try {
        const {fetch, Request, Response, Headers} = require("expo/fetch");
        global.fetch = fetch;
        global.Request = Request;
        global.Response = Response;
        global.Headers = Headers;
    } catch (_e) {
        // Fallback for environments where expo/fetch doesn't work well
        global.fetch = jest.fn();
    }
}
