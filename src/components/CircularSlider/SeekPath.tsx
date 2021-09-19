import * as React from 'react';
import Animated, { runOnJS, useAnimatedProps, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { thumbRadius, progressBarRadius, progressBarWidth, progressBarColor } from './consts';



const AnimatedPath = Animated.createAnimatedComponent(Path);

function SeekPath({ progress }) {
    const polarToCartesian = React.useCallback(
        (angle) => {
            let r = progressBarRadius;
            let hC = progressBarRadius + thumbRadius;
            let a = ((angle - 90) * Math.PI) / 180.0;

            let x = hC + r * Math.cos(a);
            let y = hC + r * Math.sin(a);
            return { x, y };
        },
        [progressBarRadius, thumbRadius]
    );

    const getSeekPath = (progress) => {
        var endCoordPath = polarToCartesian(parseInt(progress));
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
        const path = `M${startCoord.x} ${startCoord.y} A ${progressBarRadius} ${progressBarRadius} 0 ${progress > 180 ? 1 : 0
            } 1 ${endCoordPath.x} ${endCoordPath.y}`;
        seekPath.value = path;
    }


    const startCoord = polarToCartesian(0);
    // (M) move to (X, Y) (A) arc (rx ry, angle, 1 for large arc 0 for small arc, 1 for clock wise turing arc, (x, y) end coordinates ) 
    const seekPath = useSharedValue(`M${startCoord.x} ${startCoord.y} A ${progressBarRadius} ${thumbRadius} 0 ${0 > 180 ? 1 : 0} 1 ${startCoord.x} ${startCoord.y}`);

    useDerivedValue(() => {
        runOnJS(getSeekPath)(progress.value);
    });

    const animatedProps = useAnimatedProps(() => {
        return {
            d: seekPath.value,
        };
    });

    return (
        <AnimatedPath
            stroke={progressBarColor}
            strokeWidth={progressBarWidth}
            fill="none"
            strokeLinecap="round"
            animatedProps={animatedProps}
        />
    )
}

export default SeekPath;