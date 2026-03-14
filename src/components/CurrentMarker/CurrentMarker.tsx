import {View} from "react-native";
import {Circle, Marker} from "react-native-maps";
import {STRINGS} from "@/constants/strings";
import type {Coordinate} from "@/stores/location";
import {theme} from "@/theme/colors";
import {Arrow} from "../Svg/Arrow";
import {styles} from "./CurrentMarker.styles";

type CurrentMarkerProps = {
    currentLocation: Coordinate;
};

const NavigationArrow = ({color}: {color: string}) => (
    <View style={[styles.arrowContainer, styles.arrowShadow]}>
        <Arrow color={color} />
    </View>
);

export const CurrentMarker = ({currentLocation}: CurrentMarkerProps) => {
    const {latitude, longitude, heading, accuracy} = currentLocation;
    const COLORS = theme();

    return (
        <>
            {accuracy && accuracy > 0 && (
                <Circle
                    center={{latitude, longitude}}
                    radius={accuracy}
                    strokeColor={`${COLORS.accent}33`}
                    fillColor={`${COLORS.accent}1A`}
                    zIndex={0}
                />
            )}
            <Marker
                coordinate={{latitude, longitude}}
                title={STRINGS.home.current_location}
                anchor={{x: 0.5, y: 0.5}}
                rotation={heading || 0}
                flat={true}
                zIndex={10}
            >
                <NavigationArrow color={COLORS.accent} />
            </Marker>
        </>
    );
};
