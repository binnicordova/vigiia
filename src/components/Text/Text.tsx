import {Text as RNText, type TextProps} from "react-native";
import {theme} from "@/theme/colors";
import {FONT_FAMILY} from "@/theme/fonts";
import {styles} from "./Text.styles";

export type ThemedTextProps = TextProps & {
    type?:
        | "default"
        | "title"
        | "subtitle"
        | "heading"
        | "link"
        | "caption"
        | "error"
        | "label";
};

export function Text({style, type = "default", ...rest}: ThemedTextProps) {
    const {text, error} = theme();

    return (
        <RNText
            style={[
                {
                    color: text,
                    fontFamily: FONT_FAMILY.LATO_REGULAR,
                },
                type === "default" && styles.default,
                type === "title" && styles.title,
                type === "subtitle" && styles.subtitle,
                type === "heading" && styles.heading,
                type === "link" && styles.link,
                type === "caption" && styles.caption,
                type === "error" && [styles.error, {color: error}],
                type === "label" && styles.label,
                style,
            ]}
            {...rest}
        />
    );
}
