import {StyleSheet} from "react-native";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    button: {
        width: SPACING[12],
        height: SPACING[12],
        borderRadius: SPACING[6],
        alignItems: "center",
        justifyContent: "center",
    },
    shadow: {
        ...SHADOW.medium,
    },
});
