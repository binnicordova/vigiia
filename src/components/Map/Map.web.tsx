import {StyleSheet, View, type ViewProps} from "react-native";
import {Text} from "@/components/Text/Text";

export type MapProps = ViewProps;

export const Map = ({style, ...props}: MapProps) => {
    return (
        <View style={[styles.webFallback, style]} {...props}>
            <Text>Maps are not available on Web yet.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    webFallback: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
});
