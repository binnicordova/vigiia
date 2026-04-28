import {useAtomValue} from "jotai";
import {View} from "react-native";
import {STRINGS} from "@/constants/strings";
import {
    destainAtom,
    formattedDistanceAtom,
    formattedDurationAtom,
    isNearDestainAtom,
    isNearOriginAtom,
} from "@/stores/route";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";
import {Button} from "../Button/Button";
import {Card} from "../Card/Card";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./TravelCard.styles";

export type TravelCardProps = {
    testID?: string;
    onCancel?: () => void;
    onFinishPress?: () => void;
};

export const TravelCard = ({
    testID = "start-travel-card",
    onCancel,
    onFinishPress,
}: TravelCardProps) => {
    const {background, accent, lightness} = theme();

    const isOnOrigin = useAtomValue(isNearOriginAtom);
    const isOnDestain = useAtomValue(isNearDestainAtom);

    const destain = useAtomValue(destainAtom);
    const distance = useAtomValue(formattedDistanceAtom);
    const eta = useAtomValue(formattedDurationAtom);

    const address = destain?.name ?? "";

    const cardStyles = [
        styles.container,
        {backgroundColor: background},
        isOnDestain && {borderColor: accent, borderWeight: 2},
    ];

    return (
        <Card style={cardStyles} testID={testID}>
            {!isOnOrigin && !isOnDestain && (
                <View style={styles.header}>
                    <View
                        style={[
                            styles.iconContainer,
                            {backgroundColor: lightness},
                        ]}
                    >
                        <Icon
                            name="shield-sync"
                            color={accent}
                            size={FONT_SIZE[8]}
                        />
                    </View>
                    <View style={styles.titleGroup}>
                        <Text type="heading">{STRINGS.travel_card.title}</Text>
                        <Text type="default">
                            {STRINGS.travel_card.description}
                        </Text>
                    </View>
                </View>
            )}
            {isOnOrigin && !isOnDestain && (
                <>
                    <View>
                        <Text type="label" style={{color: accent}}>
                            {STRINGS.travel_card.destination_label}
                        </Text>
                        <Text
                            type="subtitle"
                            style={[styles.address, {color: accent}]}
                        >
                            {address}
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View
                            style={[
                                styles.statBox,
                                {backgroundColor: lightness},
                            ]}
                        >
                            <Text type="label" style={{color: accent}}>
                                {STRINGS.travel_card.eta_label}
                            </Text>
                            <Text type="subtitle" style={{color: accent}}>
                                {eta}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statBox,
                                {backgroundColor: lightness},
                            ]}
                        >
                            <Text type="label" style={{color: accent}}>
                                {STRINGS.travel_card.distance_label}
                            </Text>
                            <Text type="subtitle" style={{color: accent}}>
                                {distance}
                            </Text>
                        </View>
                    </View>

                    <Button
                        title={STRINGS.travel_card.cancel_button}
                        variant="outline"
                        onLongPress={onCancel}
                    />
                </>
            )}
            {isOnDestain && (
                <View style={{gap: SPACING[4]}}>
                    <View style={styles.header}>
                        <View
                            style={[
                                styles.iconContainer,
                                {backgroundColor: lightness},
                            ]}
                        >
                            <Icon
                                name="check-circle"
                                color={accent}
                                size={FONT_SIZE[8]}
                            />
                        </View>
                        <View style={styles.titleGroup}>
                            <Text type="heading">
                                {STRINGS.travel_card.arrival_title}
                            </Text>
                            <Text type="default">
                                {STRINGS.travel_card.arrival_description}
                            </Text>
                        </View>
                    </View>
                    <Button
                        title={STRINGS.travel_card.finish_button}
                        onPress={onFinishPress}
                        testID={`${testID}-button`}
                    />
                </View>
            )}
        </Card>
    );
};
