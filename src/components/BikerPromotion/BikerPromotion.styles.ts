import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING[4],
        gap: SPACING[4],
        borderRadius: RADIUS[5],
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: RADIUS[5],
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: FONT_SIZE[4],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    subtitle: {
        fontSize: FONT_SIZE[5],
        fontFamily: FONT_FAMILY.LATO_BOLD,
    },
    button: {
        width: "auto",
        paddingHorizontal: SPACING[2],
    },
});
