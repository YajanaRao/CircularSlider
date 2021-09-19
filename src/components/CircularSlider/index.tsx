import * as React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import SeekPath from './SeekPath';
import { Thumb } from './Thumb';
import { progressBarRadius, thumbRadius } from './consts';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  progress?: Animated.SharedValue<number>;
}



const CircleSlider = ({
  fillColor = 'none',
  strokeColor = '#fff',
  strokeWidth = 0.5,
  progress,
}: Props) => {
  const width = (progressBarRadius + thumbRadius) * 2;

  const percentage = useDerivedValue(() => {
    return parseInt((progress.value / 360) * 100).toString();
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      text: percentage.value,
    };
  });


  return (
    <View style={styles.container}>
      <Svg width={width} height={width}>
        <Circle
          r={progressBarRadius}
          cx={width / 2}
          cy={width / 2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
        />
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          style={[{
            transform: [{ translateX: width / 3.7 }, { translateY: width / 4 }]
          }, styles.progressText]}
          animatedProps={animatedProps}
          value={percentage.value}
        />


        <SeekPath progress={progress} />
        <Thumb progress={progress} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  progressText: { color: '#A9A9A9', fontSize: 100, fontWeight: 'bold', fontFamily: 'Roboto', }
})

export default CircleSlider;
