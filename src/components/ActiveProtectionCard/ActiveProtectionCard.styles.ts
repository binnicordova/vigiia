import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        padding: SPACING[6],
        borderRadius: RADIUS[5],
        gap: SPACING[6],
        alignItems: "center",
        width: "100%",
    },
    header: {
        alignItems: "center",
        gap: SPACING[3],
    },
    shieldContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        textAlign: "center",
        lineHeight: 28,
    },
    description: {
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: SPACING[2],
    },
    safeButton: {
        width: "100%",
        height: 64,
        borderRadius: RADIUS[5],
    },
    footerActions: {
        flexDirection: "row",
        gap: SPACING[4],
        width: "100%",
    },
    secondaryButton: {
        flex: 1,
        borderRadius: RADIUS[4],
        height: 72,
    },
    panicButtonText: {},
});
