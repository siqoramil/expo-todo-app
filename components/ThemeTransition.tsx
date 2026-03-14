import { useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
  const [bgColor, setBgColor] = useState(theme === 'dark' ? '#151718' : '#F7F8FC');

  useEffect(() => {
    if (prevTheme.current === theme) return;
    prevTheme.current = theme;

    const targetColor = theme === 'dark' ? '#151718' : '#F7F8FC';
    setBgColor(targetColor);
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
    });
  }, [theme]);

  // The circle needs to cover the entire screen from center
  const maxDimension = Math.sqrt(width * width + height * height);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

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
          backgroundColor: bgColor,
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
