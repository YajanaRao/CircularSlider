import * as React from 'react';
import { TextInput, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import SeekPath from './SeekPath';
import { Thumb } from './Thumb';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// https://github.com/bartgryszko/react-native-circular-slider/blob/master/src/CircularSlider.js
interface Props {
  btnRadius?: number;
  dialRadius?: number;
  dialWidth?: number;
  meterColor?: string;
  textColor?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  textSize?: number;
  progress?: Animated.SharedValue<number>;
  min?: number;
  max?: number;
  xCenter?: number;
  yCenter?: number;
  onValueChange?: (x: number) => number;
}



const CircleSlider = ({
  btnRadius = 15,
  dialRadius = 130,

  fillColor = 'none',
  strokeColor = '#fff',
  strokeWidth = 0.5,
  progress,
}: Props) => {
  const width = (dialRadius + btnRadius) * 2;
  const bR = btnRadius;
  const dR = dialRadius;

  const percentage = useDerivedValue(() => {
    return parseInt((progress.value / 360) * 100).toString();
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      text: percentage.value,
    };
  });


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={width} height={width}>
        <Circle
          r={dR}
          cx={width / 2}
          cy={width / 2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
        />
        <AnimatedTextInput
          // x={width / 2}
          // y={width / 1.65}
          // fontSize={100}
          // fontWeight={'bold'}
          // fill={'#A9A9A9'}
          // fontFamily="robot"
          underlineColorAndroid="transparent"
          editable={false}
          style={{
            color: '#A9A9A9', fontSize: 100, fontWeight: 'bold', fontFamily: 'Roboto', transform: [{ translateX: width / 3.7 }, { translateY: width / 4 }]
          }}
          animatedProps={animatedProps}
          value={percentage.value}
        />


        <SeekPath progress={progress} />
        <Thumb progress={progress} />
      </Svg>
    </View>
  );
};

export default CircleSlider;
