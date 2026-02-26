import React from "react";
import {render, fireEvent} from "@testing-library/react-native";
import {IconButton} from "./IconButton";

describe("IconButton Component", () => {
    it("renders correctly", () => {
        const {getByTestId} = render(
            <IconButton name="menu" onPress={() => {}} testID="icon-button" />
        );
        expect(getByTestId("icon-button")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPressMock = jest.fn();
        const {getByTestId} = render(
            <IconButton
                name="menu"
                onPress={onPressMock}
                testID="icon-button"
            />
        );

        fireEvent.press(getByTestId("icon-button"));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});
