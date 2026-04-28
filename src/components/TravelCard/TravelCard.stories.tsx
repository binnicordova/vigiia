import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {TravelCard} from "./TravelCard";

const meta = {
    title: "Components/TravelCard",
    component: TravelCard,
    args: {},
    decorators: [
        (Story) => (
            <View
                style={{
                    padding: SPACING[4],
                    backgroundColor: "#f5f5f5",
                    flex: 1,
                    justifyContent: "center",
                }}
            >
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof TravelCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OnOrigin: Story = {
    args: {},
};

export const OnRoad: Story = {
    args: {},
};
