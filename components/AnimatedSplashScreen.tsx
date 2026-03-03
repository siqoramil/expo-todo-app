import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';

const absoluteFill = StyleSheet.absoluteFillObject;

const ANIMATION_DURATION = 2200;

type Props = {
  onFinish: () => void;
  theme: 'light' | 'dark';
};

export function AnimatedSplashScreen({ onFinish, theme }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const logoScale = useSharedValue(0.3);
  const logoRotate = useSharedValue(-15);
  const logoOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a2e' : '#ffffff';
  const textColor = isDark ? '#ECEDEE' : '#11181C';
  const subtitleColor = isDark ? '#9BA1A6' : '#687076';
  const ringColor = isDark ? 'rgba(162, 155, 254, 0.15)' : 'rgba(108, 92, 231, 0.1)';

  useEffect(() => {
    // Logo appears with spring bounce
    logoOpacity.value = withTiming(1, { duration: 400 });
    logoScale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 120 }),
      withSpring(1, { damping: 12, stiffness: 100 }),
    );
    logoRotate.value = withSpring(0, { damping: 10, stiffness: 80 });

    // Ring pulse
    ringScale.value = withDelay(
      300,
      withSequence(
        withSpring(1, { damping: 6, stiffness: 60 }),
        withDelay(200, withSpring(1.1, { damping: 8, stiffness: 80 })),
        withSpring(1, { damping: 10, stiffness: 100 }),
      ),
    );
    ringOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));

    // Text appears
    textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    textTranslateY.value = withDelay(600, withSpring(0, { damping: 12, stiffness: 100 }));

    // Hide splash
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  if (!isVisible) {
    return (
      <Animated.View
        exiting={FadeOut.duration(400)}
        className="justify-center items-center z-[100]"
        style={[absoluteFill, { backgroundColor: bgColor }]}
      />
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(400)}
      className="justify-center items-center z-[100]"
      style={[absoluteFill, { backgroundColor: bgColor }]}
    >
      <View className="items-center justify-center">
        {/* Decorative ring behind logo */}
        <Animated.View
          className="absolute w-[180px] h-[180px] rounded-[90px] border-[3px]"
          style={[{ borderColor: ringColor }, ringAnimatedStyle]}
        />

        {/* App Logo */}
        <Animated.View
          className="w-[120px] h-[120px] rounded-[30px] overflow-hidden shadow-lg elevation-12"
          style={[{ shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }, logoAnimatedStyle]}
        >
          <Image
            source={require('../assets/images/splash-icon.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </Animated.View>

        {/* App name and subtitle */}
        <Animated.View
          className="items-center mt-8"
          style={textAnimatedStyle}
        >
          <Animated.Text
            entering={SlideInDown.delay(700).duration(400).springify()}
            className="text-[32px] font-bold tracking-wider"
            style={{ color: textColor }}
          >
            Todo App
          </Animated.Text>
          <Animated.Text
            entering={SlideInDown.delay(900).duration(400).springify()}
            className="text-base font-normal mt-2 tracking-wide"
            style={{ color: subtitleColor }}
          >
            Organize your life
          </Animated.Text>
        </Animated.View>
      </View>

      {/* Bottom dots decoration */}
      <Animated.View
        className="flex-row gap-2 absolute bottom-[80px]"
        style={textAnimatedStyle}
      >
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            entering={FadeIn.delay(1200 + i * 150).duration(300)}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isDark ? '#A29BFE' : '#6C5CE7',
              opacity: 1 - i * 0.25,
            }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}
