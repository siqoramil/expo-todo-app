import { Image, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const ANIMATION_DURATION = 2800;

type Props = {
  onFinish: () => void;
  theme: 'light' | 'dark';
};

// Particle config
const PARTICLE_COUNT = 12;

function generateParticles(width: number, height: number) {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 1200,
    duration: 2000 + Math.random() * 1500,
    driftX: -30 + Math.random() * 60,
    driftY: -40 + Math.random() * -60,
  }));
}

function FloatingParticle({
  x,
  y,
  size,
  delay,
  duration,
  driftX,
  driftY,
  color,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
  color: string;
}) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * interpolate(progress.value, [0, 0.5, 1], [0.3, 0.8, 0.3]),
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, driftX]) },
      { translateY: interpolate(progress.value, [0, 1], [0, driftY]) },
      { scale: interpolate(progress.value, [0, 0.5, 1], [0.5, 1.2, 0.5]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

function PulseRing({
  size,
  delay,
  color,
  borderWidth = 2,
}: {
  size: number;
  delay: number;
  color: string;
  borderWidth?: number;
}) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 800, easing: Easing.in(Easing.ease) }),
        ),
        -1,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(0.6, { duration: 800, easing: Easing.in(Easing.ease) }),
        ),
        -1,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: color,
        },
        animStyle,
      ]}
    />
  );
}

function LoadingDots({ color }: { color: string }) {
  const dots = [0, 1, 2, 3];

  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {dots.map((i) => (
        <LoadingDot key={i} index={i} color={color} />
      ))}
    </View>
  );
}

function LoadingDot({ index, color }: { index: number; color: string }) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const delay = index * 200;
    scale.value = withDelay(
      800 + delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(0.4, { duration: 400, easing: Easing.in(Easing.ease) }),
        ),
        -1,
      ),
    );
    opacity.value = withDelay(
      800 + delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(0.3, { duration: 400, easing: Easing.in(Easing.ease) }),
        ),
        -1,
      ),
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        },
        dotStyle,
      ]}
    />
  );
}

export function AnimatedSplashScreen({ onFinish, theme }: Props) {
  const { width, height } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const isDark = theme === 'dark';

  const particles = useMemo(() => generateParticles(width, height), [width, height]);

  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(-20);
  const logoOpacity = useSharedValue(0);
  const bgGlow = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const progressWidth = useSharedValue(0);
  const exitScale = useSharedValue(1);
  const exitOpacity = useSharedValue(1);

  // Colors
  const gradientLight = ['#6C5CE7', '#8B7CF7', '#A29BFE'] as const;
  const gradientDark = ['#1a1a2e', '#2D1B69', '#16213e'] as const;
  const particleColor = isDark ? 'rgba(162, 155, 254, 0.5)' : 'rgba(255, 255, 255, 0.4)';
  const ringColor = isDark ? 'rgba(162, 155, 254, 0.2)' : 'rgba(255, 255, 255, 0.25)';
  const dotColor = isDark ? '#A29BFE' : '#ffffff';

  const logoSize = Math.min(width * 0.28, 120);
  const logoRadius = logoSize * 0.25;

  useEffect(() => {
    // Background glow
    bgGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );

    // Logo entrance — bouncy spring
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSequence(
      withSpring(1.2, { damping: 6, stiffness: 150, mass: 0.8 }),
      withSpring(1, { damping: 10, stiffness: 120 }),
    );
    logoRotate.value = withSpring(0, { damping: 8, stiffness: 60 });

    // Title text
    textOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(500, withSpring(0, { damping: 14, stiffness: 100 }));

    // Subtitle
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    subtitleTranslateY.value = withDelay(800, withSpring(0, { damping: 14, stiffness: 100 }));

    // Progress bar
    progressWidth.value = withDelay(
      600,
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
    );

    // Exit animation
    const finishCallback = () => {
      setIsVisible(false);
      onFinishRef.current();
    };
    const timer = setTimeout(() => {
      exitScale.value = withTiming(1.05, { duration: 300 });
      exitOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(finishCallback)();
        }
      });
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const bgGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(bgGlow.value, [0, 1], [0.3, 0.7]),
    transform: [{ scale: interpolate(bgGlow.value, [0, 1], [1, 1.3]) }],
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const subtitleAnimStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  const containerExitStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
    transform: [{ scale: exitScale.value }],
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        },
        containerExitStyle,
      ]}>
      <LinearGradient
        colors={isDark ? [...gradientDark] : [...gradientLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Floating particles */}
        {particles.map((p) => (
          <FloatingParticle
            key={p.id}
            x={p.x}
            y={p.y}
            size={p.size}
            delay={p.delay}
            duration={p.duration}
            driftX={p.driftX}
            driftY={p.driftY}
            color={particleColor}
          />
        ))}

        {/* Background glow circle */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: logoSize * 3,
              height: logoSize * 3,
              borderRadius: logoSize * 1.5,
              backgroundColor: isDark ? 'rgba(108, 92, 231, 0.15)' : 'rgba(255, 255, 255, 0.1)',
            },
            bgGlowStyle,
          ]}
        />

        {/* Pulse rings */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <PulseRing size={logoSize * 2.5} delay={0} color={ringColor} borderWidth={1.5} />
          <PulseRing size={logoSize * 2} delay={400} color={ringColor} borderWidth={2} />
          <PulseRing size={logoSize * 1.6} delay={800} color={ringColor} borderWidth={2.5} />

          {/* Logo with shadow */}
          <Animated.View
            style={[
              {
                width: logoSize,
                height: logoSize,
                borderRadius: logoRadius,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.35,
                shadowRadius: 20,
                elevation: 20,
              },
              logoAnimStyle,
            ]}>
            <Image
              source={require('../assets/images/splash-icon.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* App name */}
        <Animated.Text
          style={[
            {
              fontSize: Math.min(width * 0.085, 34),
              fontWeight: '800',
              color: '#ffffff',
              marginTop: 28,
              letterSpacing: 1.5,
            },
            textAnimStyle,
          ]}>
          Todo App
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          style={[
            {
              fontSize: Math.min(width * 0.04, 16),
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: 8,
              letterSpacing: 0.8,
            },
            subtitleAnimStyle,
          ]}>
          Organize your life
        </Animated.Text>

        {/* Progress bar */}
        <Animated.View
          style={[
            {
              marginTop: 32,
              width: Math.min(width * 0.5, 200),
              height: 3,
              borderRadius: 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              overflow: 'hidden',
            },
            subtitleAnimStyle,
          ]}>
          <Animated.View
            style={[
              {
                height: '100%',
                borderRadius: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
              progressAnimStyle,
            ]}
          />
        </Animated.View>

        {/* Loading dots at bottom */}
        <View
          style={{
            position: 'absolute',
            bottom: Math.max(height * 0.08, 60),
            alignItems: 'center',
          }}>
          <LoadingDots color={dotColor} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
