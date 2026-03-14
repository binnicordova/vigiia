import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import type MapView from "react-native-maps";
import {Marker, Polyline} from "react-native-maps";
import {ActiveProtectionCard} from "@/components/ActiveProtectionCard/ActiveProtectionCard";
import {CurrentMarker} from "@/components/CurrentMarker/CurrentMarker";
import {DestinationCard} from "@/components/DestinationCard/DestinationCard";
import {DriverInstructionsCard} from "@/components/DriverInstructionsCard/DriverInstructionsCard";
import {Icon} from "@/components/Icon/Icon";
import {IconButton} from "@/components/IconButton/IconButton";
import {Map as MapComponent} from "@/components/Map/Map";
import {PinModal} from "@/components/PinModal/PinModal";
import {Text} from "@/components/Text/Text";
import {TravelCard} from "@/components/TravelCard/TravelCard";
import {PHONE_NUMBER} from "@/constants/env";
import {STRINGS} from "@/constants/strings";
import {currentLocationAtom} from "@/stores/location";
import {
    coordinatesAtom,
    destainAtom,
    fetchRouteAtom,
    imSafe,
    originAtom,
    resetRouteAtom,
    sendPanic,
} from "@/stores/route";
import {travelStateAtom} from "@/stores/travel";
import {BORDER} from "@/theme/border";
import {theme} from "@/theme/colors";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";
import {call, whatsapp} from "@/utils/linking";
import {calculateBearing, projectCoordinate} from "@/utils/locationChecker";

const COLORS = theme();

const clamp = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
};

export const DEFAULT_LOCATION = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const TAG = "[HOME SCREEN]";

export default function Index() {
    const [_region, setRegion] = useState(DEFAULT_LOCATION);
    const mapRef = useRef<MapView>(null);

    const [travelState, setTravelState] = useAtom(travelStateAtom);
    const origin = useAtomValue(originAtom);

    const [destination, setDestination] = useAtom(destainAtom);
    const coordinates = useAtomValue(coordinatesAtom);
    const currentLocation = useAtomValue(currentLocationAtom);

    const fetchRoute = useSetAtom(fetchRouteAtom);
    const resetRoute = useSetAtom(resetRouteAtom);

    const [firstCameraMove, setFirstCameraMove] = useState(false);
    const [pinModal, setPinModal] = useState<{
        visible: boolean;
        title: string;
        description: string;
        confirmText: string;
        onConfirm: (pin: string) => void;
    }>({
        visible: false,
        title: "",
        description: "",
        confirmText: "",
        onConfirm: () => {},
    });

    const moveToLocation = useCallback(
        (latitude: number, longitude: number) => {
            if (latitude === undefined || longitude === undefined)
                throw new Error(
                    "Latitude and longitude must be defined to move to location"
                );
            mapRef.current?.animateToRegion(
                {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                1000
            );
        },
        []
    );

    const remainingRouteCoordinates = useMemo(() => {
        if (!currentLocation || coordinates.length === 0) return [];

        const nearestCoordinateIndex = coordinates.reduce(
            (closestIndex, coordinate, index) => {
                const closestCoordinate = coordinates[closestIndex];

                const closestDistance =
                    (closestCoordinate.latitude - currentLocation.latitude) **
                        2 +
                    (closestCoordinate.longitude - currentLocation.longitude) **
                        2;

                const currentDistance =
                    (coordinate.latitude - currentLocation.latitude) ** 2 +
                    (coordinate.longitude - currentLocation.longitude) ** 2;

                return currentDistance < closestDistance ? index : closestIndex;
            },
            0
        );

        const routeTail = coordinates.slice(nearestCoordinateIndex);

        return destination
            ? [currentLocation, ...routeTail, destination]
            : [currentLocation, ...routeTail];
    }, [coordinates, currentLocation, destination]);

    useEffect(() => {
        if (destination && !firstCameraMove) {
            moveToLocation(destination.latitude, destination.longitude);
            setFirstCameraMove(true);
        }
    }, [destination, moveToLocation, firstCameraMove]);

    useEffect(() => {
        if (!currentLocation || travelState === "idle") {
            return;
        }

        const speed = Math.max(currentLocation.speed ?? 0, 0);
        const speedKilometersPerHour = speed * 3.6;

        const destinationHeading = destination
            ? calculateBearing(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  destination.latitude,
                  destination.longitude
              )
            : 0;

        const heading =
            currentLocation.heading !== null &&
            currentLocation.heading !== undefined &&
            Number.isFinite(currentLocation.heading)
                ? currentLocation.heading
                : destinationHeading;

        const lookAheadDistance = clamp(24 + speed * 2.8, 24, 90);
        const center = projectCoordinate(
            currentLocation.latitude,
            currentLocation.longitude,
            lookAheadDistance,
            heading
        );

        mapRef.current?.animateCamera(
            {
                center,
                pitch: clamp(52 + speedKilometersPerHour * 0.28, 52, 68),
                heading,
                zoom: clamp(17.8 - speedKilometersPerHour / 65, 15.8, 17.8),
            },
            {duration: 650}
        );
    }, [currentLocation, destination, travelState]);

    const onDestinationSelect = (coordinate: typeof destination) => {
        if (!coordinate) throw new Error("Coordinate must be defined");
        if (travelState === "idle") {
            mapRef.current?.animateToRegion(
                {
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                1000
            );
        }
    };

    const onDestinationPress = async () => {
        console.log(TAG, "Destination press initiated");
        setPinModal({
            visible: true,
            title: "Crear PIN de Seguridad",
            description:
                "Define un PIN único para este viaje. Lo necesitarás para confirmar que estás seguro y para finalizar el viaje.",
            confirmText: "Iniciar Viaje",
            onConfirm: async (pin: string) => {
                if (!pin || pin.toString().trim() === "") {
                    Alert.alert(
                        "PIN Requerido",
                        "Por favor ingresa un PIN para continuar"
                    );
                    return;
                }
                if (pin && pin.toString().length < 4) {
                    Alert.alert(
                        "PIN Inválido",
                        "El PIN debe tener al menos 4 dígitos"
                    );
                    return;
                }

                try {
                    await fetchRoute(pin);
                    setTravelState("on-road");
                    setPinModal((prev) => ({...prev, visible: false}));
                } catch {
                    Alert.alert(
                        "Error",
                        "No se pudo obtener la ruta. ¿Deseas intentarlo de nuevo?",
                        [
                            {text: "Cancelar", style: "cancel"},
                            {text: "Reintentar", onPress: onDestinationPress},
                        ]
                    );
                }
            },
        });
    };

    const onCancelPress = () => {
        setPinModal({
            visible: true,
            title: "Cancelar Viaje",
            description:
                "¿Estás seguro de que deseas cancelar el viaje? Se detendrá el monitoreo de tu ubicación, y perderás la protección en tiempo real.",
            confirmText: "Sí, Cancelar",
            onConfirm: async (pin: string) => {
                if (!pin || pin.toString().trim() === "") {
                    Alert.alert(
                        "PIN Requerido",
                        "Por favor ingresa el PIN para confirmar la cancelación"
                    );
                    return;
                }
                await resetRoute(pin);
                setTravelState("idle");
                setPinModal((prev) => ({...prev, visible: false}));
            },
        });
    };

    const onSafePress = () => {
        setPinModal({
            visible: true,
            title: "Estoy Seguro",
            description:
                "Hemos enfocado nuestra atención en tu viaje debido a una posible situación de riesgo. Si estás seguro y deseas indicar que todo está bien, por favor confirma a continuación.",
            confirmText: "Sí, Estoy Seguro",
            onConfirm: async (pin: string) => {
                if (!pin || pin.toString().trim() === "") {
                    Alert.alert(
                        "PIN Requerido",
                        "Por favor ingresa el PIN para confirmar que estás seguro"
                    );
                    return;
                }
                imSafe(pin);
                setPinModal((prev) => ({...prev, visible: false}));
            },
        });
    };

    const onFinishPress = () => {
        setPinModal({
            visible: true,
            title: "Finalizar Viaje",
            description:
                "¿Deseas finalizar el viaje? Asegúrate de haber llegado a tu destino y estar seguro antes de confirmar.",
            confirmText: "Sí, Finalizar",
            onConfirm: async (pin: string) => {
                if (!pin || pin.toString().trim() === "") {
                    Alert.alert(
                        "PIN Requerido",
                        "Por favor ingresa el PIN para confirmar que deseas finalizar el viaje"
                    );
                    return;
                }
                await resetRoute(pin);
                setTravelState("idle");
                setPinModal((prev) => ({...prev, visible: false}));
            },
        });
    };

    const handleRegionChange = (newRegion: typeof DEFAULT_LOCATION) => {
        setRegion(newRegion);
        if (travelState === "idle") {
            setDestination({
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
            });
        }
    };

    const moveToCurrentLocation = () => {
        if (!currentLocation)
            throw new Error("Current location is not available");
        moveToLocation(currentLocation.latitude, currentLocation.longitude);
    };

    return (
        <View style={styles.container}>
            <MapComponent
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                initialRegion={DEFAULT_LOCATION}
                onRegionChange={handleRegionChange}
                pitchEnabled
                showsBuildings
            >
                {!currentLocation && (
                    <View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        <Text>Cargando ubicación...</Text>
                    </View>
                )}
                {currentLocation && travelState !== "idle" && (
                    <CurrentMarker currentLocation={currentLocation} />
                )}

                {origin && (
                    <Marker
                        coordinate={origin}
                        title={STRINGS.home.punto_partida}
                        anchor={{x: 0.5, y: 0.5}}
                    >
                        <View style={styles.startMarker}>
                            <View style={styles.startMarkerInner} />
                        </View>
                    </Marker>
                )}
                {destination && (
                    <Marker
                        coordinate={destination}
                        title={STRINGS.home.punto_destino}
                        anchor={{x: 0.5, y: 1}}
                    >
                        <Icon
                            name="map-marker"
                            size={40}
                            color={COLORS.accent}
                        />
                    </Marker>
                )}
                {coordinates.length > 0 && (
                    <Polyline
                        coordinates={coordinates}
                        strokeColor={COLORS.accent}
                        strokeWidth={BORDER[5]}
                        lineDashPattern={[BORDER[5], BORDER[5]]}
                    />
                )}

                {travelState !== "idle" &&
                    remainingRouteCoordinates.length > 1 && (
                        <Polyline
                            coordinates={remainingRouteCoordinates}
                            strokeColor={COLORS.darkness}
                            strokeWidth={BORDER[4]}
                        />
                    )}
            </MapComponent>

            {travelState === "idle" && (
                <IconButton
                    name="menu"
                    onPress={() => {}}
                    style={styles.menuButton}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
                pointerEvents="box-none"
            >
                {["on-road", "on-road-alert"].includes(travelState) && (
                    <DriverInstructionsCard
                        alert={travelState === "on-road-alert"}
                    />
                )}

                <View style={styles.spacer} pointerEvents="none" />

                <IconButton
                    name="map-marker-radius"
                    onPress={moveToCurrentLocation}
                    style={styles.mapButton}
                />
                {travelState === "idle" && (
                    <DestinationCard
                        onPressAction={onDestinationPress}
                        onDestinationSelect={onDestinationSelect}
                    />
                )}

                {travelState === "on-road" && (
                    <>
                        <IconButton
                            name="face-agent"
                            onPress={() => whatsapp(PHONE_NUMBER)}
                            style={styles.mapButton}
                        />
                        <TravelCard
                            onCancel={onCancelPress}
                            onFinishPress={onFinishPress}
                        />
                    </>
                )}

                {travelState === "on-road-alert" && (
                    <ActiveProtectionCard
                        onSafePress={onSafePress}
                        onPanicPress={sendPanic}
                        onCallPress={() => call(PHONE_NUMBER)}
                    />
                )}
            </KeyboardAvoidingView>

            <PinModal
                visible={pinModal.visible}
                title={pinModal.title}
                description={pinModal.description}
                confirmText={pinModal.confirmText}
                cancelText="Cancelar"
                onConfirm={pinModal.onConfirm}
                onCancel={() =>
                    setPinModal((prev) => ({...prev, visible: false}))
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        padding: SPACING[4],
        paddingTop: SPACING[15],
        paddingBottom: SPACING[8],
        gap: SPACING[4],
    },
    spacer: {
        flex: 1,
    },
    menuButton: {
        position: "absolute",
        top: SPACING[15],
        left: SPACING[6],
        width: SPACING[12],
        height: SPACING[12],
        borderRadius: SPACING[6],
        backgroundColor: COLORS.background,
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW.medium,
    },
    mapButton: {
        alignSelf: "flex-end",
    },
    startMarker: {
        width: SPACING[8],
        height: SPACING[8],
        borderRadius: SPACING[4],
        borderWidth: BORDER[1],
        borderColor: COLORS.accent,
        alignItems: "center",
        justifyContent: "center",
    },
    startMarkerInner: {
        width: SPACING[4],
        height: SPACING[4],
        borderRadius: SPACING[2],
        backgroundColor: COLORS.accent,
    },
    truckMarker: {
        width: 32,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
    },
    truckCab: {
        width: 24,
        height: 20,
        backgroundColor: COLORS.accent,
        borderRadius: 4,
        zIndex: 2,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderColor: "rgba(0,0,0,0.2)",
    },
    movingShadow: {
        shadowColor: COLORS.accent,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    truckTrailer: {
        marginTop: -4,
        width: 28,
        height: 44,
        backgroundColor: COLORS.background,
        borderRadius: 2,
        zIndex: 1,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderColor: "rgba(0,0,0,0.2)",
    },
});
