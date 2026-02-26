import {forwardRef} from "react";
import MapView, {type MapViewProps, PROVIDER_GOOGLE} from "react-native-maps";
import {styles} from "./Map.styles";

export type MapProps = MapViewProps & {
    children?: React.ReactNode;
};

export const Map = forwardRef<MapView, MapProps>(
    ({style, children, ...props}, ref) => {
        return (
            <MapView
                ref={ref}
                provider={PROVIDER_GOOGLE}
                style={[styles.map, style]}
                {...props}
            >
                {children}
            </MapView>
        );
    }
);
