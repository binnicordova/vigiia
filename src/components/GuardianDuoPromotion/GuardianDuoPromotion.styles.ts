import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE, LINE_HEIGHT} from "@/theme/fonts";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        padding: SPACING[5],
        borderRadius: SPACING[5],
        backgroundColor: "#111827",
        gap: SPACING[5],
        ...SHADOW.large,
    },
    header: {
        flexDirection: "row",
        gap: SPACING[4],
        alignItems: "center",
    },
    iconContainer: {
        width: SPACING[14],
        height: SPACING[14],
        borderRadius: RADIUS[5],
        backgroundColor: "#2E1E14",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        gap: SPACING[1] / 2,
    },
    title: {
        color: "white",
        fontSize: FONT_SIZE[5],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        lineHeight: LINE_HEIGHT[5],
    },
    description: {
        color: "#94A3B8",
        fontSize: FONT_SIZE[3],
        lineHeight: LINE_HEIGHT[4],
    },
    highlight: {
        color: "#FF7A00",
        fontFamily: FONT_FAMILY.LATO_BOLD,
        fontSize: FONT_SIZE[3],
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: SPACING[2],
    },
    avatarGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarWrapper: {
        marginLeft: -SPACING[3],
        borderWidth: 2,
        borderColor: "#111827",
    },
    avatarFirst: {
        marginLeft: 0,
    },
    button: {
        width: "auto",
        paddingHorizontal: SPACING[5],
        height: SPACING[12],
        borderRadius: SPACING[6],
    },
});
