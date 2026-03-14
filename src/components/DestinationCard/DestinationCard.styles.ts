import {StyleSheet} from "react-native";
import {RADIUS} from "@/theme/border";
import {ELEVATION} from "@/theme/elevation";
import {SHADOW} from "@/theme/shadow";
import {SPACING} from "@/theme/spacing";

export const styles = StyleSheet.create({
    container: {
        padding: SPACING[4],
        borderRadius: RADIUS[8],
        gap: SPACING[2],
        ...SHADOW.large,
    },
    suggestionsContainer: {
        position: "absolute",
        bottom: "100%",
        left: SPACING[0],
        right: SPACING[0],
        marginBottom: SPACING[2],
        ...SHADOW.large,
        zIndex: ELEVATION[3],
        overflow: "hidden",
    },
});
