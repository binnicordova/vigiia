import {fireEvent, render} from "@testing-library/react-native";
import {useAtomValue} from "jotai";
import {STRINGS} from "@/constants/strings";
import {
    destainAtom,
    formattedDistanceAtom,
    formattedDurationAtom,
    isNearDestainAtom,
    isNearOriginAtom,
} from "@/stores/route";
import {TravelCard} from "./TravelCard";

jest.mock("jotai", () => ({
    useAtomValue: jest.fn(),
}));

describe("TravelCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === isNearOriginAtom) return false;
            if (atom === isNearDestainAtom) return false;
            if (atom === destainAtom) return {name: "Test Destination"};
            if (atom === formattedDistanceAtom) return "10 km";
            if (atom === formattedDurationAtom) return "15 min";
            return null;
        });
    });

    it("renders title when not on origin", () => {
        const {getByText} = render(<TravelCard />);
        expect(getByText(STRINGS.travel_card.title)).toBeTruthy();
    });

    it("renders details and cancel button when on origin", () => {
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === isNearOriginAtom) return true;
            if (atom === isNearDestainAtom) return false;
            if (atom === destainAtom) return {name: "Test Destination"};
            if (atom === formattedDistanceAtom) return "10 km";
            if (atom === formattedDurationAtom) return "15 min";
            return null;
        });

        const onCancel = jest.fn();
        const {getByText} = render(<TravelCard onCancel={onCancel} />);

        expect(getByText("Test Destination")).toBeTruthy();
        expect(getByText(STRINGS.travel_card.cancel_button)).toBeTruthy();

        fireEvent(getByText(STRINGS.travel_card.cancel_button), "onLongPress");
        expect(onCancel).toHaveBeenCalled();
    });

    it("renders finish button when on destination", () => {
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === isNearOriginAtom) return false;
            if (atom === isNearDestainAtom) return true;
            if (atom === destainAtom) return {name: "Test Destination"};
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
