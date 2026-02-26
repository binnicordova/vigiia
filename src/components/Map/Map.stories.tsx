import type {Meta, StoryObj} from "@storybook/react";
import {Map} from "./Map";

const meta = {
    title: "Map",
    component: Map,
} satisfies Meta<typeof Map>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        initialRegion: {
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
    },
};
