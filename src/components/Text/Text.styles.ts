import {StyleSheet} from "react-native";
import {FONT_FAMILY, FONT_SIZE, LINE_HEIGHT} from "@/theme/fonts";
import {OPACITY} from "@/theme/opcacity";

export const styles = StyleSheet.create({
    default: {
        fontSize: FONT_SIZE[4],
        lineHeight: LINE_HEIGHT[4],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    title: {
        fontSize: FONT_SIZE[8],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        lineHeight: LINE_HEIGHT[7],
    },
    subtitle: {
        fontSize: FONT_SIZE[6],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        lineHeight: LINE_HEIGHT[5],
    },
    heading: {
        fontSize: FONT_SIZE[5],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        lineHeight: LINE_HEIGHT[4],
    },
    link: {
        fontSize: FONT_SIZE[4],
        textDecorationLine: "underline",
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    caption: {
        fontSize: FONT_SIZE[3],
        opacity: OPACITY[1],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    error: {
        fontSize: FONT_SIZE[4],
        lineHeight: LINE_HEIGHT[4],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    label: {
        fontSize: FONT_SIZE[3],
        lineHeight: LINE_HEIGHT[3],
        fontFamily: FONT_FAMILY.LATO_BOLD,
    },
});
