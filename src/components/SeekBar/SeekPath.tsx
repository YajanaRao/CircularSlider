import * as React from 'react';
import Animated, { runOnJS, useAnimatedProps, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { bR, btnRadius, dialRadius, dialWidth, dR, meterColor } from './consts';



const AnimatedPath = Animated.createAnimatedComponent(Path);

function SeekPath({ progress }) {
    const polarToCartesian = React.useCallback(
        (angle) => {
            let r = dialRadius;
            let hC = dialRadius + btnRadius;
            let a = ((angle - 90) * Math.PI) / 180.0;

            let x = hC + r * Math.cos(a);
            let y = hC + r * Math.sin(a);
            return { x, y };
        },
        [dialRadius, btnRadius]
    );

    const getSeekPath = (progress) => {
        var endCoordPath = polarToCartesian(parseInt(progress));
        const path = `M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 ${progress > 180 ? 1 : 0
            } 1 ${endCoordPath.x} ${endCoordPath.y}`;
        seekPath.value = path;
    }


    const startCoord = polarToCartesian(0);
    const seekPath = useSharedValue(`M${startCoord.x} ${startCoord.y} A ${dR} ${bR} 0 ${0 > 180 ? 1 : 0} 1 ${startCoord.x} ${startCoord.y}`);

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
            stroke={meterColor}
            strokeWidth={dialWidth}
            fill="none"
            strokeLinecap="round"
            // d={path}
            animatedProps={animatedProps}
        />
    )
}

export default SeekPath;