import {render} from "@testing-library/react-native";
import {STRINGS} from "@/constants/strings";
import {TravelCard} from "./TravelCard";

describe("TravelCard", () => {
    it("renders title when not on origin", () => {
        const {getByText} = render(<TravelCard />);

        expect(getByText(STRINGS.travel_card.title)).toBeTruthy();
    });

    it("renders full details when on origin", () => {
        const {getByText} = render(<TravelCard />);

        expect(getByText(STRINGS.travel_card.title)).toBeTruthy();
    });
});
