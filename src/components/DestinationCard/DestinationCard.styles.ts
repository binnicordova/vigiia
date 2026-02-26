import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        padding: SPACING[6],
        borderRadius: RADIUS[8],
        gap: SPACING[4],
        ...SHADOW.large,
    },
    suggestionsContainer: {
        position: "absolute",
        bottom: "100%",
        left: 0,
        right: 0,
        marginBottom: SPACING[3],
        ...SHADOW.large,
        zIndex: 10,
        overflow: "hidden",
    },
});
