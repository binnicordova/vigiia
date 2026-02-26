import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {Button} from "./Button";

const meta = {
    title: "Button",
    component: Button,
    args: {
        title: "Click Me",
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        onPress: action("onPress"),
    },
};

export const Outline: Story = {
    args: {
        title: "Outline Button",
        variant: "outline",
        onPress: action("onPress"),
    },
};

export const TextVariant: Story = {
    args: {
        title: "Text Button",
        variant: "text",
        onPress: action("onPress"),
    },
};

export const WithIcon: Story = {
    args: {
        title: "Button with Icon",
        icon: "shield-outline",
        onPress: action("onPress"),
    },
};
