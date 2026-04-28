import type {Meta, StoryObj} from "@storybook/react";
import {type Atom, Provider} from "jotai";
import {useHydrateAtoms} from "jotai/utils";
import {View} from "react-native";
import {currentLocationAtom} from "@/stores/location";
import {destainAtom, routeStepsAtom} from "@/stores/route";
import {DriverInstructionsCard} from "./DriverInstructionsCard";

const HydrateAtoms = ({
    atomValues,
    children,
}: {
    atomValues: Iterable<readonly [Atom<unknown>, unknown]>;
    children: React.ReactNode;
}) => {
    // biome-ignore lint/suspicious/noExplicitAny: hydration types are complex
    useHydrateAtoms(atomValues as any);
    return children;
};

const meta: Meta<typeof DriverInstructionsCard> = {
    title: "Components/DriverInstructionsCard",
    component: DriverInstructionsCard,
    decorators: [
        (Story) => (
            <View style={{padding: 20, backgroundColor: "#f5f5f5", flex: 1}}>
                <Story />
            </View>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof DriverInstructionsCard>;

export const Default: Story = {
    decorators: [
        (Story) => (
            <Provider>
                <HydrateAtoms
                    atomValues={[
                        [
                            currentLocationAtom,
                            {latitude: 37.7749, longitude: -122.4194},
                        ],
                        [
                            destainAtom,
                            {
                                latitude: 37.775,
                                longitude: -122.4195,
                                name: "Market St",
                            },
                        ],
                        [routeStepsAtom, []],
                    ]}
                >
                    <Story />
                </HydrateAtoms>
            </Provider>
        ),
    ],
};

export const TurnLeft: Story = {
    decorators: [
        (Story) => (
            <Provider>
                <HydrateAtoms
                    atomValues={[
                        [
                            currentLocationAtom,
                            {latitude: 37.7749, longitude: -122.4194},
                        ],
                        [
                            destainAtom,
                            {
                                latitude: 37.785,
                                longitude: -122.4295,
                                name: "Main St",
                            },
                        ],
                        [
                            routeStepsAtom,
                            [
                                {
                                    distance: 100,
                                    duration: 10,
                                    name: "Valencia St",
                                    maneuver: {
                                        type: "turn",
                                        modifier: "left",
                                        coordinate: {
                                            latitude: 37.775,
                                            longitude: -122.4195,
                                        },
                                    },
                                },
                            ],
                        ],
                    ]}
                >
                    <Story />
                </HydrateAtoms>
            </Provider>
        ),
    ],
};

export const Arriving: Story = {
    decorators: [
        (Story) => (
            <Provider>
                <HydrateAtoms
                    atomValues={[
                        [
                            currentLocationAtom,
                            {latitude: 37.7749, longitude: -122.4194},
                        ],
                        [
                            destainAtom,
                            {
                                latitude: 37.775,
                                longitude: -122.4195,
                                name: "Work",
                            },
                        ],
                        [
                            routeStepsAtom,
                            [
                                {
                                    distance: 10,
                                    duration: 2,
                                    name: "Work",
                                    maneuver: {
                                        type: "arrive",
                                        coordinate: {
                                            latitude: 37.775,
                                            longitude: -122.4195,
                                        },
                                    },
                                },
                            ],
                        ],
                    ]}
                >
                    <Story />
                </HydrateAtoms>
            </Provider>
        ),
    ],
};
