import {View} from "react-native";
import {STRINGS} from "@/constants/strings";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Button} from "../Button/Button";
import {Card} from "../Card/Card";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./ActiveProtectionCard.styles";

export type ActiveProtectionCardProps = {
    onCallPress?: () => void;
    onPanicPress?: () => void;
    testID?: string;
};

export const ActiveProtectionCard = ({
    onCallPress,
    onPanicPress,
    testID = "active-protection-card",
}: ActiveProtectionCardProps) => {
    const {background} = theme();

    return (
        <Card
            style={[styles.container, {backgroundColor: background}]}
            testID={testID}
        >
            <View style={styles.header}>
                <View style={styles.shieldContainer}>
                    <Icon
                        name="shield-alert"
                        color="#ef4444"
                        size={FONT_SIZE[12]}
                    />
                </View>
                <Text type="subtitle" style={styles.title}>
                    {STRINGS.active_protection.title}
                </Text>
                <Text type="default" style={styles.description}>
                    {STRINGS.active_protection.description}
                </Text>
            </View>

            <View style={styles.footerActions}>
                <Button
                    title={STRINGS.active_protection.call_central_button}
                    icon="phone"
                    onPress={onCallPress}
                    variant="outline"
                    style={styles.secondaryButton}
                    testID={`${testID}-call-button`}
                />
                <Button
                    title={STRINGS.active_protection.panic_button}
                    icon="alert"
                    onPress={onPanicPress}
                    variant="outline"
                    style={styles.secondaryButton}
                    testID={`${testID}-panic-button`}
                />
            </View>
        </Card>
    );
};
