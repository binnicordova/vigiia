import {render} from "@testing-library/react-native";
import {Provider} from "jotai";
import {DriverInstructionsCard} from "./DriverInstructionsCard";

jest.mock("jotai", () => {
    const originalJotai = jest.requireActual("jotai");
    return {
        ...originalJotai,
        useAtomValue: jest.fn(),
    };
});

import {useAtomValue} from "jotai";

describe("DriverInstructionsCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAtomValue as jest.Mock).mockReturnValue({
            instruction: "Continúa hacia",
            label: "tu destino",
            distance: 0,
            iconName: "navigation-variant",
        });
    });

    it("renders with default instruction values", () => {
        const {getByText} = render(
            <Provider>
                <DriverInstructionsCard />
            </Provider>
        );

        // Checking for some parts of the default state defined in the atom
        expect(getByText(/tu destino/i)).toBeTruthy();
    });

    it("renders specific instructions when atom is hydrated", () => {
        const mockInstruction = {
            instruction: "En 200 metros gira a la derecha",
            label: "Avenida Siempreviva",
            distance: 200,
            iconName: "arrow-right",
        };

        (useAtomValue as jest.Mock).mockReturnValue(mockInstruction);

        const {getByText} = render(
            <Provider>
                <DriverInstructionsCard />
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

        (useAtomValue as jest.Mock).mockReturnValue(mockInstruction);

        const {getByText} = render(
            <Provider>
                <DriverInstructionsCard />
            </Provider>
        );

        expect(getByText("Has llegado a")).toBeTruthy();
        expect(getByText("Tu destino")).toBeTruthy();
    });
});
