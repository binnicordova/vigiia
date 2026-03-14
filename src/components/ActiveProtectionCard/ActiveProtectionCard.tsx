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
    onSafePress: () => void;
    onCallPress: () => void;
    onPanicPress: () => void;
    testID?: string;
};

export const ActiveProtectionCard = ({
    onSafePress,
    onCallPress,
    onPanicPress,
    testID = "active-protection-card",
}: ActiveProtectionCardProps) => {
    const {background, accent} = theme();

    return (
        <Card
            style={[styles.container, {backgroundColor: background}]}
            testID={testID}
        >
            <View style={styles.header}>
                <View style={styles.shieldContainer}>
                    <Icon
                        name="shield-alert"
                        color={accent}
                        size={FONT_SIZE[16]}
                        style={{position: "absolute", top: 0, right: 0}}
                    />
                </View>

                <View style={styles.headerContent}>
                    <Text type="subtitle">
                        {STRINGS.active_protection.title}
                    </Text>
                    <Text type="default">
                        {STRINGS.active_protection.description}
                    </Text>
                </View>
            </View>

            <Button
                title={STRINGS.active_protection.safe_button}
                icon="check-circle-outline"
                onPress={onSafePress}
                style={styles.safeButton}
                testID={`${testID}-safe-button`}
            />

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
