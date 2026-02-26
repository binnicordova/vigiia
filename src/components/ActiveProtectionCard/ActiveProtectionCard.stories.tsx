import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {ActiveProtectionCard} from "./ActiveProtectionCard";

const meta = {
    title: "Components/ActiveProtectionCard",
    component: ActiveProtectionCard,
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
} satisfies Meta<typeof ActiveProtectionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onSafePress: () => console.log("I am safe"),
        onCallPress: () => console.log("Calling central"),
        onPanicPress: () => console.log("Panic!"),
    },
};
