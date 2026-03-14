import {render} from "@testing-library/react-native";
import {type Atom, Provider} from "jotai";
import {useHydrateAtoms} from "jotai/utils";
import type React from "react";
import {driverInstructionAtom} from "@/stores/instructions";
import {DriverInstructionsCard} from "./DriverInstructionsCard";

/**
 * Helper component to hydrate atoms for testing
 */
const HydrateAtoms = ({
    atomValues,
    children,
}: {
    atomValues: Iterable<readonly [Atom<unknown>, unknown]>;
    children: React.ReactNode;
}) => {
    // biome-ignore lint/suspicious/noExplicitAny: hydration types are complex
    useHydrateAtoms(atomValues as any);
    return children;
};

describe("DriverInstructionsCard", () => {
    it("renders with default instruction values", () => {
        const {getByText} = render(
            <Provider>
                <DriverInstructionsCard />
            </Provider>
        );

        // Checking for some parts of the default state defined in the atom
        expect(getByText(/hacia/i)).toBeTruthy();
    });

    it("renders specific instructions when atom is hydrated", () => {
        const mockInstruction = {
            instruction: "En 200 metros gira a la derecha",
            label: "Avenida Siempreviva",
            distance: 200,
            iconName: "arrow-right",
        };

        const {getByText} = render(
            <Provider>
                <HydrateAtoms
                    atomValues={[[driverInstructionAtom, mockInstruction]]}
                >
                    <DriverInstructionsCard />
                </HydrateAtoms>
            </Provider>
        );

        expect(getByText("En 200 metros gira a la derecha")).toBeTruthy();
        expect(getByText("Avenida Siempreviva")).toBeTruthy();
    });

    it("renders arrive message correctly", () => {
        const mockInstruction = {
            instruction: "Has llegado a",
            label: "Tu destino",
            distance: 0,
            iconName: "check",
        };

        const {getByText} = render(
            <Provider>
                <HydrateAtoms
                    atomValues={[[driverInstructionAtom, mockInstruction]]}
                >
                    <DriverInstructionsCard />
                </HydrateAtoms>
            </Provider>
        );

        expect(getByText("Has llegado a")).toBeTruthy();
        expect(getByText("Tu destino")).toBeTruthy();
    });
});
