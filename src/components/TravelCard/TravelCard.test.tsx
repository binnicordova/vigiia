import {fireEvent, render} from "@testing-library/react-native";
import {useAtomValue} from "jotai";
import {STRINGS} from "@/constants/strings";
import {TravelCard} from "./TravelCard";

jest.mock("jotai", () => ({
    useAtomValue: jest.fn(),
}));

describe("TravelCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom.toString().includes("isNearOriginAtom")) return false;
            if (atom.toString().includes("isNearDestainAtom")) return false;
            if (atom.toString().includes("destainAtom"))
                return {name: "Test Destination"};
            if (atom.toString().includes("formattedDistanceAtom"))
                return "10 km";
            if (atom.toString().includes("formattedDurationAtom"))
                return "15 min";
            return null;
        });
    });

    it("renders title when not on origin", () => {
        const {getByText} = render(<TravelCard />);
        expect(getByText(STRINGS.travel_card.title)).toBeTruthy();
    });

    it("renders details and safe button when on origin", () => {
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            const atomStr = atom.toString();
            if (atomStr.includes("isNearOriginAtom")) return true;
            if (atomStr.includes("isNearDestainAtom")) return false;
            if (atomStr.includes("destainAtom"))
                return {name: "Test Destination"};
            if (atomStr.includes("formattedDistanceAtom")) return "10 km";
            if (atomStr.includes("formattedDurationAtom")) return "15 min";
            return null;
        });

        const onSafePress = jest.fn();
        const {getByText} = render(<TravelCard onFinishPress={onSafePress} />);

        expect(getByText("Test Destination")).toBeTruthy();
        expect(getByText(STRINGS.active_protection.safe_button)).toBeTruthy();

        fireEvent.press(getByText(STRINGS.active_protection.safe_button));
        expect(onSafePress).toHaveBeenCalled();
    });

    it("renders finish button when on destination", () => {
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            const atomStr = atom.toString();
            if (atomStr.includes("isNearOriginAtom")) return false;
            if (atomStr.includes("isNearDestainAtom")) return true;
            if (atomStr.includes("destainAtom"))
                return {name: "Test Destination"};
            return null;
        });

        const onFinishPress = jest.fn();
        const {getByTestId} = render(
            <TravelCard onFinishPress={onFinishPress} />
        );

        const finishButton = getByTestId("start-travel-card-button");
        expect(finishButton).toBeTruthy();

        fireEvent.press(finishButton);
        expect(onFinishPress).toHaveBeenCalled();
    });
});
