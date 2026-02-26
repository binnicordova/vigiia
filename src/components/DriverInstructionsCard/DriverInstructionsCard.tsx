import {View} from "react-native";
import {useAtomValue} from "jotai";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Card} from "../Card/Card";
import {Icon, type IconName} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./DriverInstructionsCard.styles";
import {driverInstructionAtom} from "@/stores/instructions";

export type DriverInstructionsCardProps = {
    testID?: string;
};

export const DriverInstructionsCard = ({
    testID = "driver-instructions-card",
}: DriverInstructionsCardProps) => {
    const {background} = theme();
    const driverInstruction = useAtomValue(driverInstructionAtom);

    const instruction = driverInstruction.instruction;
    const instructionLabel = driverInstruction.label;
    const iconName: IconName = driverInstruction.iconName;

    return (
        <Card
            style={[styles.container, {backgroundColor: background}]}
            testID={testID}
        >
            <View style={styles.iconContainer}>
                <Icon name={iconName} color="white" size={FONT_SIZE[9]} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.instruction} type="caption">
                    {instruction}
                </Text>
                <Text style={styles.destination} type="title">
                    {instructionLabel}
                </Text>
            </View>
        </Card>
    );
};
