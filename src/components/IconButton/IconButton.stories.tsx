import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {theme} from "@/theme/colors";
import {IconButton} from "./IconButton";
import {FONT_SIZE} from "@/theme/fonts";

const COLORS = theme();

const meta = {
    title: "IconButton",
    component: IconButton,
    args: {
        name: "menu",
        onPress: action("onPress"),
    },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        name: "menu",
    },
};

export const Accent: Story = {
    args: {
        name: "map-marker",
        backgroundColor: COLORS.accent,
        color: COLORS.background,
    },
};

export const Large: Story = {
    args: {
        name: "lock",
        size: FONT_SIZE[9],
    },
};

export const WithoutShadow: Story = {
    args: {
        name: "bell",
        shadow: false,
    },
};
