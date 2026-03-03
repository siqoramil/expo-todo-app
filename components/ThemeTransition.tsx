import { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

type Props = {
  theme: 'light' | 'dark';
};

export function ThemeTransition({ theme }: Props) {
  const { width, height } = useWindowDimensions();
  const prevTheme = useRef(theme);
  const circleScale = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const overlayColor = useSharedValue(theme === 'dark' ? '#151718' : '#F7F8FC');

  useEffect(() => {
    if (prevTheme.current === theme) return;
    prevTheme.current = theme;

    const targetColor = theme === 'dark' ? '#151718' : '#F7F8FC';
    overlayColor.value = targetColor;
    isAnimating.value = true;
    overlayOpacity.value = 1;
    circleScale.value = 0;

    circleScale.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    // Fade out the overlay after circle expands
    overlayOpacity.value = withTiming(0, {
      duration: 650,
      easing: Easing.inOut(Easing.cubic),
    }, () => {
      isAnimating.value = false;
    });
  }, [theme]);

  // The circle needs to cover the entire screen from center
  const maxDimension = Math.sqrt(width * width + height * height);

  const circleStyle = useAnimatedStyle(() => {
    if (!isAnimating.value && overlayOpacity.value === 0) {
      return {
        opacity: 0,
        transform: [{ scale: 0 }],
      };
    }
    return {
      opacity: overlayOpacity.value,
      backgroundColor: overlayColor.value,
      transform: [{ scale: circleScale.value }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.overlay,
        {
          width: maxDimension,
          height: maxDimension,
          borderRadius: maxDimension / 2,
          left: (width - maxDimension) / 2,
          top: (height - maxDimension) / 2,
        },
        circleStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 99,
  },
});
