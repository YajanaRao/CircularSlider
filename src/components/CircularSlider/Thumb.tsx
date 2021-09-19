import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedProps, useDerivedValue, useSharedValue, runOnJS } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { thumbRadius, progressBarRadius, xCenter, yCenter } from './consts';

export interface ThumbProps {
    progress: Animated.SharedValue<number>
}

const AnimatedCircle = Animated.createAnimatedComponent(Path);

export function Thumb({ progress }: ThumbProps) {

    const cartesianToPolar = React.useCallback(
        (x, y) => {
            let hC = progressBarRadius + thumbRadius;

            if (x === 0) {
                return y > hC ? 0 : 180;
            } else if (y === 0) {
                return x > hC ? 90 : 270;
            } else {
                return (
                    Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) +
                    (x > hC ? 90 : 270)
                );
            }
        },
        [progressBarRadius, thumbRadius]
    );

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

    const thumbPosition = useSharedValue(`M ${thumbRadius} ${thumbRadius}m 15,0a 15,15 0 1,0 -30,0a 15,15 0 1,0 30,0`);


    function updateThumbPosition(event) {
        let xOrigin = xCenter - (progressBarRadius + thumbRadius);
        let yOrigin = yCenter - (progressBarRadius + thumbRadius);
        let a = cartesianToPolar(
            event.absoluteX - xOrigin,
            event.absoluteY - yOrigin
        );
        getThumbPosition(a);
        progress.value = a;
    }
    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event, ctx) => {
            runOnJS(updateThumbPosition)(event)
        },
    });

    const getThumbPosition = (progress) => {
        const { x, y } = polarToCartesian(progress);
        thumbPosition.value = getCircle(x, y);
    }


    useDerivedValue(() => {
        runOnJS(getThumbPosition)(progress.value);
    })


    const animatedProps = useAnimatedProps(() => {
        return {
            d: thumbPosition.value
        };
    });

    function getCircle(cx = thumbRadius, cy = thumbRadius) {
        let dx = 15, dy = -0;
        return "M " + cx + " " + cy + "m " + dx + "," + dy + "a " + thumbRadius + "," + thumbRadius + " 0 1,0 " + -2 * dx + "," + -2 * dy + "a " + thumbRadius + "," + thumbRadius + " 0 1,0 " + 2 * dx + "," + 2 * dy;
    }

    return (
        <PanGestureHandler onGestureEvent={gestureHandler} >
            <AnimatedCircle
                fill="white"
                stroke="none"
                animatedProps={animatedProps}
            />
        </PanGestureHandler>
    );
}
