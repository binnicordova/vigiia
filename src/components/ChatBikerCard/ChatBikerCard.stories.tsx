import type {Meta, StoryObj} from "@storybook/react";
import {View} from "react-native";
import {SPACING} from "@/theme/spacing";
import {ChatBikerCard} from "./ChatBikerCard";

const meta = {
    title: "Components/ChatBikerCard",
    component: ChatBikerCard,
    args: {
        name: "Rodrigo García",
        rating: "4.9",
        paymentMethod: "Pago con Efectivo",
        eta: "12:58",
        avatarUri: "https://i.pravatar.cc/150?u=rodrigo",
    },
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
} satisfies Meta<typeof ChatBikerCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DifferentBiker: Story = {
    args: {
        name: "Maria Paz",
        rating: "5.0",
        paymentMethod: "Tarjeta de Crédito",
        eta: "13:15",
        avatarUri: "https://i.pravatar.cc/150?u=maria",
    },
};
