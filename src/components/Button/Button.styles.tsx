import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

const BUTTON_HEIGHT = 56;

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING[6],
        paddingVertical: SPACING[2],
        alignSelf: "stretch",
        borderRadius: RADIUS[5],
        height: BUTTON_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: SPACING[3],
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
    },
    text: {
        backgroundColor: "transparent",
    },
    label: {
        fontSize: FONT_SIZE[4],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        textTransform: "uppercase",
    },
    disabled: {
        opacity: 0.5,
    },
});
