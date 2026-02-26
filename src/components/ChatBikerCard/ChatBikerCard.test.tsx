import {fireEvent, render} from "@testing-library/react-native";
import {STRINGS} from "@/constants/strings";
import {ChatBikerCard} from "./ChatBikerCard";

describe("ChatBikerCard", () => {
    const defaultProps = {
        name: "Rodrigo García",
        rating: "4.9",
        paymentMethod: "Pago con Efectivo",
        eta: "12:58",
    };

    it("renders biker information correctly", () => {
        const {getByText} = render(<ChatBikerCard {...defaultProps} />);

        expect(getByText(defaultProps.name)).toBeTruthy();
        expect(getByText(defaultProps.rating)).toBeTruthy();
        expect(getByText(defaultProps.paymentMethod)).toBeTruthy();
        expect(getByText(defaultProps.eta)).toBeTruthy();
        expect(getByText(STRINGS.chat_biker_card.eta_label)).toBeTruthy();
    });

    it("calls onNotNowPress when not now button is pressed", () => {
        const onNotNowPressMock = jest.fn();
        const {getByTestId} = render(
            <ChatBikerCard
                {...defaultProps}
                onNotNowPress={onNotNowPressMock}
            />
        );

        const notNowButton = getByTestId("chat-biker-card-not-now-button");
        fireEvent.press(notNowButton);

        expect(onNotNowPressMock).toHaveBeenCalledTimes(1);
    });

    it("calls onContractPress when contract button is pressed", () => {
        const onContractPressMock = jest.fn();
        const {getByTestId} = render(
            <ChatBikerCard
                {...defaultProps}
                onContractPress={onContractPressMock}
            />
        );

        const contractButton = getByTestId("chat-biker-card-contract-button");
        fireEvent.press(contractButton);

        expect(onContractPressMock).toHaveBeenCalledTimes(1);
    });
});
