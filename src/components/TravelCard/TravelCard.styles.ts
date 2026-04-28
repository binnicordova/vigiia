import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        padding: SPACING[4],
        borderRadius: RADIUS[6],
        gap: SPACING[2],
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[4],
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: RADIUS[4],
        alignItems: "center",
        justifyContent: "center",
    },
    titleGroup: {
        flex: 1,
        gap: SPACING[1],
    },
    indicationContainer: {
        padding: SPACING[3],
        borderRadius: RADIUS[3],
    },
    indications: {
        fontSize: FONT_SIZE[3],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        textAlign: "center",
    },
    simpleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: SPACING[4],
        gap: SPACING[3],
    },
    simpleText: {
        fontSize: FONT_SIZE[4],
        fontFamily: FONT_FAMILY.LATO_BOLD,
    },
    address: {
        marginTop: SPACING[2],
    },
    statsRow: {
        flexDirection: "row",
        gap: SPACING[4],
        marginTop: SPACING[2],
    },
    statBox: {
        flex: 1,
        padding: SPACING[4],
        borderRadius: RADIUS[4],
        gap: SPACING[1],
    },
    actionRow: {
        flexDirection: "row",
        gap: SPACING[4],
        marginTop: SPACING[4],
    },
    actionButton: {
        flex: 1,
    },
});
