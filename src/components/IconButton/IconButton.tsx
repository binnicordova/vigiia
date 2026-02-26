import React from "react";
import {
    type GestureResponderEvent,
    TouchableOpacity,
    type ViewStyle,
} from "react-native";
import {theme} from "@/theme/colors";
import {FONT_SIZE} from "@/theme/fonts";
import {Icon, type IconProps} from "../Icon/Icon";
import {styles} from "./IconButton.styles";
import {OPACITY} from "@/theme/opcacity";

const COLORS = theme();

export interface IconButtonProps extends Omit<IconProps, "style"> {
    onPress?: (event: GestureResponderEvent) => void;
    style?: ViewStyle;
    backgroundColor?: string;
    shadow?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
    name,
    size = FONT_SIZE[7],
    color = COLORS.text,
    onPress,
    style: containerStyle,
    backgroundColor = COLORS.background,
    shadow = true,
    ...iconProps
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {backgroundColor},
                shadow && styles.shadow,
                containerStyle,
            ]}
            onPress={onPress}
            activeOpacity={OPACITY[3]}
        >
            <Icon name={name} size={size} color={color} {...iconProps} />
        </TouchableOpacity>
    );
};
