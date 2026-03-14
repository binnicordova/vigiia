import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING[5],
        gap: SPACING[5],
        borderRadius: RADIUS[5],
        width: "100%",
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: RADIUS[4],
        backgroundColor: "#3b82f6",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        gap: SPACING[1],
    },
    instruction: {
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontSize: FONT_SIZE[3],
        color: "#64748b",
        fontFamily: FONT_FAMILY.LATO_BOLD,
    },
});
