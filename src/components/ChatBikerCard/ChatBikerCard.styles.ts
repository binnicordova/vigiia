import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        padding: SPACING[5],
        borderRadius: RADIUS[5],
        gap: SPACING[4],
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    bikerInfo: {
        flex: 1,
        marginLeft: SPACING[3],
        gap: SPACING[1],
    },
    name: {
        fontSize: FONT_SIZE[5],
        fontFamily: FONT_FAMILY.LATO_BOLD,
    },
    metadata: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[1],
    },
    rating: {
        fontSize: FONT_SIZE[4],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    dot: {
        fontSize: FONT_SIZE[4],
    },
    payment: {
        fontSize: FONT_SIZE[4],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    etaContainer: {
        alignItems: "flex-end",
    },
    etaLabel: {
        fontSize: FONT_SIZE[3],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    etaValue: {
        fontSize: FONT_SIZE[7],
        fontFamily: FONT_FAMILY.LATO_BOLD,
    },
    actions: {
        flexDirection: "row",
        gap: SPACING[3],
        alignItems: "center",
    },
    notNowButton: {
        flex: 1,
    },
    contractButton: {
        flex: 2,
    },
});
