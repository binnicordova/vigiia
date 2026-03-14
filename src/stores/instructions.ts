import {atom} from "jotai";
import type {IconName} from "@/components/Icon/Icon";
import {destainAtom, type RouteStep, routeStepsAtom} from "@/stores/route";
import {calculateDistance} from "@/utils/measurements";
import {currentLocationAtom} from "./location";

export type DriverInstruction = {
    instruction: string;
    label: string;
    distance: number;
    iconName: IconName;
};

const STEP_SWITCH_THRESHOLD = 30;

const getInstructionIcon = (step: RouteStep): IconName => {
    if (step.maneuver.type === "arrive") {
        return "map-marker-check-outline";
    }

    if (
        step.maneuver.type === "roundabout" ||
        step.maneuver.type === "rotary"
    ) {
        return "rotate-right";
    }

    switch (step.maneuver.modifier) {
        case "left":
        case "slight left":
        case "sharp left":
            return "arrow-top-left";
        case "right":
        case "slight right":
        case "sharp right":
            return "arrow-top-right";
        case "uturn":
            return "undo-variant";
        case "straight":
            return "arrow-up";
        default:
            return "navigation-variant";
    }
};

const getDirectionText = (modifier?: string): string => {
    switch (modifier) {
        case "left":
        case "slight left":
            return "a la izquierda";
        case "right":
        case "slight right":
            return "a la derecha";
        case "sharp left":
            return "cerrado a la izquierda";
        case "sharp right":
            return "cerrado a la derecha";
        case "uturn":
            return "en U";
        case "straight":
            return "recto";
        default:
            return "";
    }
};

const createDriverInstruction = (
    step: RouteStep,
    distanceToStep: number,
    destinationName?: string
): DriverInstruction => {
    const placeName = step.name || destinationName || "tu destino";
    const direction = getDirectionText(step.maneuver.modifier);

    if (step.maneuver.type === "arrive") {
        return {
            instruction:
                distanceToStep <= STEP_SWITCH_THRESHOLD
                    ? "Has llegado a"
                    : `En ${Math.round(distanceToStep)} metros llegarás a`,
            label: placeName,
            distance: Math.max(0, distanceToStep),
            iconName: getInstructionIcon(step),
        };
    }

    const prefix =
        distanceToStep <= STEP_SWITCH_THRESHOLD
            ? "Ahora"
            : `A ${Math.round(distanceToStep)} metros`;

    if (step.maneuver.type === "continue" || direction === "recto") {
        return {
            instruction: `${prefix} continúa por`,
            label: placeName,
            distance: Math.max(0, distanceToStep),
            iconName: getInstructionIcon(step),
        };
    }

    if (
        step.maneuver.type === "roundabout" ||
        step.maneuver.type === "rotary"
    ) {
        return {
            instruction: `${prefix} toma la rotonda hacia`,
            label: placeName,
            distance: Math.max(0, distanceToStep),
            iconName: getInstructionIcon(step),
        };
    }

    if (direction === "en U") {
        return {
            instruction: `${prefix} gira en U en`,
            label: placeName,
            distance: Math.max(0, distanceToStep),
            iconName: getInstructionIcon(step),
        };
    }

    return {
        instruction: `${prefix} gira ${direction || ""} en`.trim(),
        label: placeName,
        distance: Math.max(0, distanceToStep),
        iconName: getInstructionIcon(step),
    };
};

const baseDriverInstructionAtom = atom<DriverInstruction>({
    instruction: "Continúa hacia",
    label: "tu destino",
    distance: 0,
    iconName: "navigation-variant",
});

export const driverInstructionAtom = atom<DriverInstruction>((get) => {
    const currentLocation = get(currentLocationAtom);
    const destination = get(destainAtom);
    const steps = get(routeStepsAtom);

    if (steps.length === 0 || !currentLocation || !destination) {
        return (
            get(baseDriverInstructionAtom) || {
                instruction: "Continúa hacia",
                label: destination?.name || "tu destino",
                distance: 0,
                iconName: "navigation-variant",
            }
        );
    }

    let closestStepIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    steps.forEach((step, index) => {
        const coordinate = step.maneuver.coordinate;
        if (!coordinate) {
            return;
        }

        const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            coordinate.latitude,
            coordinate.longitude
        );

        if (distance < closestDistance) {
            closestDistance = distance;
            closestStepIndex = index;
        }
    });

    const hasNextStep = closestStepIndex < steps.length - 1;
    const targetStepIndex =
        closestDistance <= STEP_SWITCH_THRESHOLD && hasNextStep
            ? closestStepIndex + 1
            : closestStepIndex;

    const targetStep = steps[targetStepIndex];
    const targetCoordinate = targetStep.maneuver.coordinate;

    const distanceToStep = targetCoordinate
        ? calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              targetCoordinate.latitude,
              targetCoordinate.longitude
          )
        : targetStep.distance;

    return createDriverInstruction(
        targetStep,
        distanceToStep,
        destination.name
    );
});
