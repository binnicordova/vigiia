import {render} from "@testing-library/react-native";
import {Map} from "./Map";

jest.mock("react-native-maps", () => {
    const React = require("react");
    const {View} = require("react-native");
    return {
        __esModule: true,
        default: (props: React.ComponentProps<typeof View>) =>
            React.createElement(View, props),
        PROVIDER_GOOGLE: "google",
    };
});

describe("Map Component", () => {
    it("renders correctly", () => {
        const {toJSON} = render(<Map />);
        expect(toJSON()).toMatchSnapshot();
    });
});
