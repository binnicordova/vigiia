import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {FONT_FAMILY, FONT_SIZE} from "@/theme/fonts";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: SPACING[4],
    },
    label: {
        fontSize: FONT_SIZE[4],
        fontFamily: FONT_FAMILY.LATO_BOLD,
        marginBottom: SPACING[2],
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        borderWidth: 0,
        borderRadius: RADIUS[3],
        paddingHorizontal: SPACING[5],
        gap: SPACING[3],
    },
    input: {
        flex: 1,
        height: "100%",
        fontSize: FONT_SIZE[4],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
    },
    errorInput: {
        borderColor: "red", // Will be overridden by theme error color
    },
    errorText: {
        fontSize: FONT_SIZE[1],
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        marginTop: SPACING[1],
    },
});
