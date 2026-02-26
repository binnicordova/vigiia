import {fireEvent, render} from "@testing-library/react-native";
import {STRINGS} from "@/constants/strings";
import {BikerPromotion} from "./BikerPromotion";

describe("BikerPromotion", () => {
    it("renders title and subtitle correctly", () => {
        const {getByText} = render(<BikerPromotion />);

        expect(getByText(STRINGS.biker_promotion.title)).toBeTruthy();
        expect(getByText(STRINGS.biker_promotion.subtitle)).toBeTruthy();
    });

    it("renders the button text correctly", () => {
        const {getByText} = render(<BikerPromotion />);
        // Button text has a newline but getByText should match or we can check part of it
        expect(getByText(/VER/)).toBeTruthy();
        expect(getByText(/MÁS/)).toBeTruthy();
    });

    it("calls onPress when button is pressed", () => {
        const onPressMock = jest.fn();
        const {getByTestId} = render(<BikerPromotion onPress={onPressMock} />);

        const button = getByTestId("biker-promotion-button");
        fireEvent.press(button);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});
