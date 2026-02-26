import {fireEvent, render} from "@testing-library/react-native";
import {DestinationCard} from "./DestinationCard";

describe("DestinationCard Component", () => {
    it("renders correctly with default props", () => {
        const {getByText} = render(<DestinationCard />);
        expect(getByText("¿A dónde vas?")).toBeTruthy();
        expect(getByText("RESGUARDAME")).toBeTruthy();
    });

    it("triggers onPressAction when action button is clicked", () => {
        const onPressAction = jest.fn();
        const {getByText} = render(
            <DestinationCard onPressAction={onPressAction} />
        );
        fireEvent.press(getByText("RESGUARDAME"));
        expect(onPressAction).toHaveBeenCalled();
    });
});
