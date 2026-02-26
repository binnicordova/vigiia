import {
    TextInput,
    type TextInputProps,
    View,
    type ViewProps,
} from "react-native";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Icon, type IconName} from "../Icon/Icon";
import {Text} from "../Text/Text";
import {styles} from "./Input.styles";

export type InputProps = TextInputProps & {
    label?: string;
    error?: string;
    leftIcon?: IconName;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewProps["style"];
};

export const Input = ({
    label,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    style,
    ...props
}: InputProps) => {
    const {text, accent, error: errorColor} = theme();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text type="label" style={[styles.label, {color: text}]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: error
                            ? `${errorColor}10`
                            : `${text}05`,
                    },
                ]}
            >
                {leftIcon && (
                    <Icon name={leftIcon} size={FONT_SIZE[2]} color={accent} />
                )}
                <TextInput
                    {...props}
                    style={[
                        styles.input,
                        {
                            color: text,
                        },
                        style,
                    ]}
                    placeholderTextColor={`${text}60`}
                />
                {rightIcon && <View>{rightIcon}</View>}
            </View>
            {error && (
                <Text
                    type="error"
                    style={[styles.errorText, {color: errorColor}]}
                >
                    {error}
                </Text>
            )}
        </View>
    );
};
