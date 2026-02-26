import {Alert, View} from "react-native";
import {useAtomValue} from "jotai";
import {STRINGS} from "@/constants/strings";
import {
    destainAtom,
    formattedDistanceAtom,
    formattedDurationAtom,
    isNearDestainAtom,
    isNearOriginAtom,
} from "@/stores/location";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Card} from "../Card/Card";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./TravelCard.styles";
import {Button} from "../Button/Button";

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

    const address = destain.name ?? "";

    return (
        <Card
            style={[styles.container, {backgroundColor: background}]}
            testID={testID}
        >
            {!isOnOrigin && (
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
                        <Text type="heading" style={styles.title}>
                            {STRINGS.travel_card.title}
                        </Text>
                        <Text type="default" style={styles.description}>
                            {STRINGS.travel_card.description}
                        </Text>
                    </View>
                </View>
            )}
            {isOnOrigin && (
                <>
                    <View>
                        <Text
                            type="label"
                            style={[styles.statLabel, {color: accent}]}
                        >
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
                            <Text
                                type="label"
                                style={[styles.statLabel, {color: accent}]}
                            >
                                {STRINGS.travel_card.eta_label}
                            </Text>
                            <Text
                                type="subtitle"
                                style={[styles.statValue, {color: accent}]}
                            >
                                {eta}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statBox,
                                {backgroundColor: lightness},
                            ]}
                        >
                            <Text
                                type="label"
                                style={[styles.statLabel, {color: accent}]}
                            >
                                {STRINGS.travel_card.distance_label}
                            </Text>
                            <Text
                                type="subtitle"
                                style={[styles.statValue, {color: accent}]}
                            >
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
                <Button
                    title={STRINGS.travel_card.finish_button}
                    onPress={onFinishPress}
                    testID={`${testID}-button`}
                />
            )}
        </Card>
    );
};
