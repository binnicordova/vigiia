import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {DestinationCard} from "./DestinationCard";

const meta = {
    title: "Components/DestinationCard",
    component: DestinationCard,
} satisfies Meta<typeof DestinationCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        onPressAction: action("onPressAction"),
    },
};
