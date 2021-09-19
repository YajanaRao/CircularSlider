import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
// You can import from local files
import CircularSlider from './src/components/CircularSlider';

Animated.addWhitelistedNativeProps({ text: true });

export default function App() {
  const percentage = 40;

  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(percentage / 100 * 360, { duration: 1000 });
  }, [progress]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <CircularSlider
          progress={progress}
          strokeColor="#1A2B29"
          strokeWidth={15}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#1D1D1D',
  },
});
