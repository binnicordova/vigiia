import {View, type ViewProps} from "react-native";
import {Avatar} from "@/components/Avatar/Avatar";
import {Button} from "@/components/Button/Button";
import {Icon} from "@/components/Icon/Icon";
import {Text} from "@/components/Text/Text";
import {STRINGS} from "@/constants/strings";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {styles} from "./GuardianDuoPromotion.styles";

export type GuardianDuoPromotionProps = ViewProps & {
    onSubscribe?: () => void;
};

export const GuardianDuoPromotion = ({
    onSubscribe,
    style,
    ...props
}: GuardianDuoPromotionProps) => {
    const {accent} = theme();

    return (
        <View {...props} style={[styles.container, style]}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Icon name="shield" size={32} color={accent} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {STRINGS.home.promotion_title}
                    </Text>
                    <Text style={styles.description}>
                        {STRINGS.home.promotion_description}
                        <Text style={styles.highlight}>
                            {STRINGS.home.promotion_highlight}
                        </Text>
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.avatarGroup}>
                    <Avatar
                        name="G"
                        size={FONT_SIZE[12]}
                        style={[
                            styles.avatarWrapper,
                            styles.avatarFirst,
                            {backgroundColor: "#475569", zIndex: 1},
                        ]}
                    />
                    <Avatar
                        name="B"
                        size={FONT_SIZE[12]}
                        style={[
                            styles.avatarWrapper,
                            {backgroundColor: accent, zIndex: 2},
                        ]}
                    />
                    <Avatar
                        name="A"
                        size={FONT_SIZE[12]}
                        style={[
                            styles.avatarWrapper,
                            {backgroundColor: accent, zIndex: 3},
                        ]}
                    />
                </View>

                <Button
                    title={STRINGS.home.promotion_button}
                    onPress={onSubscribe}
                    style={styles.button}
                />
            </View>
        </View>
    );
};
