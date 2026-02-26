import {View} from "react-native";
import {STRINGS} from "@/constants/strings";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Button} from "../Button/Button";
import {Card} from "../Card/Card";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./BikerPromotion.styles";

export type BikerPromotionProps = {
    onPress?: () => void;
    testID?: string;
};

export const BikerPromotion = ({
    onPress,
    testID = "biker-promotion",
}: BikerPromotionProps) => {
    const {accent, lightness, background} = theme();

    return (
        <Card
            style={[
                styles.container,
                {
                    backgroundColor: background,
                    borderColor: lightness,
                },
            ]}
            testID={testID}
        >
            <View style={[styles.iconContainer, {backgroundColor: lightness}]}>
                <Icon name="motorbike" color={accent} size={FONT_SIZE[9]} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    {STRINGS.biker_promotion.title}
                </Text>
                <Text style={styles.subtitle}>
                    {STRINGS.biker_promotion.subtitle}
                </Text>
            </View>

            <Button
                title={STRINGS.biker_promotion.button}
                onPress={onPress}
                variant="text"
                style={styles.button}
                testID={`${testID}-button`}
            />
        </Card>
    );
};
