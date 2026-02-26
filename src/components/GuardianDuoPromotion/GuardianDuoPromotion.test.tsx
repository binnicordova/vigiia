import {fireEvent, render} from "@testing-library/react-native";
import {GuardianDuoPromotion} from "./GuardianDuoPromotion";

describe("GuardianDuoPromotion Component", () => {
    it("renders correctly", () => {
        const {getByText} = render(<GuardianDuoPromotion />);
        expect(getByText(/Protege tu vehículo/)).toBeTruthy();
        expect(getByText("Suscribirme Ahora")).toBeTruthy();
    });

    it("triggers onSubscribe when button is pressed", () => {
        const onSubscribe = jest.fn();
        const {getByText} = render(
            <GuardianDuoPromotion onSubscribe={onSubscribe} />
        );
        fireEvent.press(getByText("Suscribirme Ahora"));
        expect(onSubscribe).toHaveBeenCalled();
    });
});
