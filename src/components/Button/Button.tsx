import {Text, TouchableOpacity, type TouchableOpacityProps} from "react-native";
import {theme} from "@/theme/colors";
import {Icon, type IconName} from "../Icon/Icon";
import {styles} from "./Button.styles";

export type ButtonProps = TouchableOpacityProps & {
    title: string;
    icon?: IconName;
    variant?: "primary" | "outline" | "text";
};

export const Button = ({
    title,
    icon,
    onPress,
    disabled,
    style,
    variant = "primary",
    ...props
}: ButtonProps) => {
    const {background, accent} = theme();

    const getColors = () => {
        switch (variant) {
            case "outline":
                return {
                    background: "transparent",
                    text: accent,
                    border: accent,
                };
            case "text":
                return {
                    background: "transparent",
                    text: accent,
                    border: "transparent",
                };
            default:
                return {
                    background: accent,
                    text: background,
                    border: accent,
                };
        }
    };

    const colors = getColors();

    return (
        <TouchableOpacity
            {...props}
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                },
                variant === "outline" && styles.outline,
                variant === "text" && styles.text,
                disabled && styles.disabled,
                style,
            ]}
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
        >
            {icon && <Icon name={icon} size={20} color={colors.text} />}
            <Text style={[styles.label, {color: colors.text}]}>{title}</Text>
        </TouchableOpacity>
    );
};
