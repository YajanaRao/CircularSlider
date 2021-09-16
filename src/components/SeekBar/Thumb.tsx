import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedProps, useDerivedValue, useSharedValue, runOnJS } from 'react-native-reanimated';
import { Circle, G } from 'react-native-svg';
import { bR, btnRadius, dialRadius, max, min, xCenter, yCenter } from './consts';
// import { polarToCartesian } from '../utils';

export interface ThumbProps {
    progress: Animated.SharedValue<number>
}

const AnimatedGroup = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function Thumb({ progress }: ThumbProps) {

    const cartesianToPolar = React.useCallback(
        (x, y) => {
            let hC = dialRadius + btnRadius;

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
        [dialRadius, btnRadius]
    );

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

    const thumbPosition = useSharedValue(() => polarToCartesian(0));
    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event, ctx) => {
            let xOrigin = xCenter - (dialRadius + btnRadius);
            let yOrigin = yCenter - (dialRadius + btnRadius);
            let a = cartesianToPolar(
                event.absoluteX - xOrigin,
                event.absoluteY - yOrigin
            );
            if (a <= min) {
                progress.value = min;
            } else if (a >= max) {
                progress.value = max;
            } else {
                progress.value = a;
            }
        },
    });

    const getThumbPosition = (progress) => {
        thumbPosition.value = polarToCartesian(progress);
    }


    useDerivedValue(() => {
        runOnJS(getThumbPosition)(progress.value);
    })


    const animatedGroupProps = useAnimatedProps(() => {

        return {
            x: thumbPosition.value.x - bR,
            y: thumbPosition.value.y - bR,
        };
    });

    return (
        <AnimatedGroup animatedProps={animatedGroupProps}>
            <PanGestureHandler onGestureEvent={gestureHandler} >
                <AnimatedCircle
                    r={bR}
                    cx={bR}
                    cy={bR}
                    fill={'white'}
                // {...panResponder.panHandlers}
                />

            </PanGestureHandler>
        </AnimatedGroup >
    );
}
