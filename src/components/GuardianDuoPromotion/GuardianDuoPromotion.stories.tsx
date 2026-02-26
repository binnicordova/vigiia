import {action} from "@storybook/addon-actions";
import type {Meta, StoryObj} from "@storybook/react";
import {GuardianDuoPromotion} from "./GuardianDuoPromotion";

const meta = {
    title: "Components/GuardianDuoPromotion",
    component: GuardianDuoPromotion,
} satisfies Meta<typeof GuardianDuoPromotion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        onSubscribe: action("onSubscribe"),
    },
};
