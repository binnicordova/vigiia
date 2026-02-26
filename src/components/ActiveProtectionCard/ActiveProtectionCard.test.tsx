import {fireEvent, render} from "@testing-library/react-native";
import {STRINGS} from "@/constants/strings";
import {ActiveProtectionCard} from "./ActiveProtectionCard";

describe("ActiveProtectionCard", () => {
    it("renders title and description correctly", () => {
        const {getByText} = render(<ActiveProtectionCard />);

        expect(getByText(STRINGS.active_protection.title)).toBeTruthy();
        expect(getByText(STRINGS.active_protection.description)).toBeTruthy();
    });

    it("calls onSafePress when safe button is pressed", () => {
        const onSafePressMock = jest.fn();
        const {getByTestId} = render(
            <ActiveProtectionCard onSafePress={onSafePressMock} />
        );

        const button = getByTestId("active-protection-card-safe-button");
        fireEvent.press(button);

        expect(onSafePressMock).toHaveBeenCalledTimes(1);
    });

    it("calls onCallPress when call button is pressed", () => {
        const onCallPressMock = jest.fn();
        const {getByTestId} = render(
            <ActiveProtectionCard onCallPress={onCallPressMock} />
        );

        const button = getByTestId("active-protection-card-call-button");
        fireEvent.press(button);

        expect(onCallPressMock).toHaveBeenCalledTimes(1);
    });

    it("calls onPanicPress when panic button is pressed", () => {
        const onPanicPressMock = jest.fn();
        const {getByTestId} = render(
            <ActiveProtectionCard onPanicPress={onPanicPressMock} />
        );

        const button = getByTestId("active-protection-card-panic-button");
        fireEvent.press(button);

        expect(onPanicPressMock).toHaveBeenCalledTimes(1);
    });
});
