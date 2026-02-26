import {View} from "react-native";
import {STRINGS} from "@/constants/strings";
import {theme} from "@/theme/colors";
import {Avatar} from "../Avatar/Avatar";
import {Button} from "../Button/Button";
import {Card} from "../Card/Card";
import {Icon} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./ChatBikerCard.styles";

export type ChatBikerCardProps = {
    name: string;
    rating: string;
    paymentMethod: string;
    eta: string;
    avatarUri?: string;
    onNotNowPress?: () => void;
    onContractPress?: () => void;
    testID?: string;
};

export const ChatBikerCard = ({
    name,
    rating,
    paymentMethod,
    eta,
    avatarUri,
    onNotNowPress,
    onContractPress,
    testID = "chat-biker-card",
}: ChatBikerCardProps) => {
    const {accent, background} = theme();

    return (
        <Card
            style={[styles.container, {backgroundColor: background}]}
            testID={testID}
        >
            <View style={styles.header}>
                <Avatar uri={avatarUri} name={name} size={60} />
                <View style={styles.bikerInfo}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.metadata}>
                        <Icon name="star" color="#fbbf24" size={16} />
                        <Text style={styles.rating}>{rating}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.payment}>{paymentMethod}</Text>
                    </View>
                </View>
                <View style={styles.etaContainer}>
                    <Text style={styles.etaLabel}>
                        {STRINGS.chat_biker_card.eta_label}
                    </Text>
                    <Text style={[styles.etaValue, {color: accent}]}>
                        {eta}
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <Button
                    title={STRINGS.chat_biker_card.not_now_button}
                    onPress={onNotNowPress}
                    variant="text"
                    style={[styles.notNowButton]}
                    testID={`${testID}-not-now-button`}
                />

                <Button
                    title={STRINGS.chat_biker_card.contract_button}
                    onPress={onContractPress}
                    style={styles.contractButton}
                    testID={`${testID}-contract-button`}
                />
            </View>
        </Card>
    );
};
