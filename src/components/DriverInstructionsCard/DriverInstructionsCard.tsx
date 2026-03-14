import {useAtomValue} from "jotai";
import {View} from "react-native";
import {driverInstructionAtom} from "@/stores/instructions";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Card} from "../Card/Card";
import {Icon, type IconName} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./DriverInstructionsCard.styles";

export type DriverInstructionsCardProps = {
    testID?: string;
    alert?: boolean;
};

export const DriverInstructionsCard = ({
    testID = "driver-instructions-card",
    alert = false,
}: DriverInstructionsCardProps) => {
    const {background, error, accent} = theme();
    const driverInstruction = useAtomValue(driverInstructionAtom);

    if (alert) {
        return (
            <Card
                style={[styles.container, {backgroundColor: background}]}
                testID={testID}
            >
                <View style={[styles.iconContainer, {backgroundColor: error}]}>
                    <Icon name="alert" color="white" size={FONT_SIZE[9]} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.instruction} type="caption">
                        ALERTA DE DESVIACIÓN
                    </Text>
                    <Text type="subtitle" style={{color: accent}}>
                        RETORNA A LA RUTA PROTEGIDA PRONTO
                    </Text>
                </View>
            </Card>
        );
    }

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
                <Text type="default">{instructionLabel}</Text>
            </View>
        </Card>
    );
};
