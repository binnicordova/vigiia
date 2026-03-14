import {useCallback, useState} from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import {RADIUS} from "@/theme/border";
import {theme} from "@/theme/colors";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";
import {Button} from "../Button/Button";
import {Input} from "../Input/Input";
import {Text} from "../Text/Text";

interface PinModalProps {
    visible: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    onConfirm: (pin: string) => void;
    onCancel: () => void;
}

export const PinModal = ({
    visible,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
}: PinModalProps) => {
    const [pin, setPin] = useState("");
    const colors = theme();

    const handleConfirm = useCallback(() => {
        onConfirm(pin);
        setPin("");
    }, [onConfirm, pin]);

    const handleCancel = useCallback(() => {
        onCancel();
        setPin("");
    }, [onCancel]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.centeredView}
            >
                <View
                    style={[
                        styles.modalView,
                        {backgroundColor: colors.background},
                    ]}
                >
                    <Text type="subtitle">{title}</Text>
                    <Text type="default">{description}</Text>

                    <Input
                        value={pin}
                        onChangeText={setPin}
                        autoFocus
                        placeholder="****"
                        keyboardType="numeric"
                        secureTextEntry
                        maxLength={6}
                        containerStyle={styles.inputContainer}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title={cancelText}
                            onPress={handleCancel}
                            variant="outline"
                            style={styles.button}
                        />
                        <Button
                            title={confirmText}
                            onPress={handleConfirm}
                            style={styles.button}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        width: "90%",
        margin: SPACING[4],
        borderRadius: RADIUS[6],
        padding: SPACING[4],
        gap: SPACING[2],
        alignItems: "center",
        ...SHADOW.medium,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: SPACING[2],
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        marginBottom: SPACING[4],
        textAlign: "center",
        opacity: 0.8,
    },
    inputContainer: {
        marginBottom: SPACING[6],
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SPACING[2],
    },
    button: {
        flex: 1,
    },
});
