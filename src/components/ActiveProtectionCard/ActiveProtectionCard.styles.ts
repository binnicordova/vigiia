import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        padding: SPACING[6],
        borderRadius: RADIUS[5],
        gap: SPACING[2],
        alignItems: "center",
        width: "100%",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[3],
        width: "100%",
    },
    shieldContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    headerContent: {
        flex: 1,
        justifyContent: "center",
    },
    safeButton: {
        width: "100%",
    },
    footerActions: {
        flexDirection: "row",
        gap: SPACING[2],
        width: "100%",
    },
    secondaryButton: {
        flex: 1,
    },
    panicButtonText: {},
});
