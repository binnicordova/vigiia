import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {BikerPromotion} from "./BikerPromotion";

const meta = {
    title: "Components/BikerPromotion",
    component: BikerPromotion,
    decorators: [
        (Story) => (
            <View
                style={{
                    padding: SPACING[4],
                    backgroundColor: "#f0f0f0",
                    flex: 1,
                    justifyContent: "center",
                }}
            >
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof BikerPromotion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onPress: () => console.log("Biker Promotion Pressed"),
    },
};
