import {Path, Svg} from "react-native-svg";
import type {SvgProps} from "./svg.props";

export const Arrow = (props: SvgProps) => (
    <Svg width={40} height={40} viewBox="0 0 100 100">
        <Path
            d="M50 5L10 95L50 75L90 95Z"
            fill={props.color}
            stroke="white"
            strokeWidth="4"
            strokeLinejoin="round"
        />
    </Svg>
);
