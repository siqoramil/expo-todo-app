import { useState, useEffect } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, {
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedView = Animated.View;

interface AuthInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  autoComplete?: 'email' | 'password' | 'new-password';
  isDark: boolean;
  delay?: number;
  accentColor?: string;
}

export function AuthInput({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  isDark,
  delay = 0,
  accentColor = '#6C5CE7',
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const focusProgress = useSharedValue(0);
  const labelProgress = useSharedValue(value ? 1 : 0);
  const iconScale = useSharedValue(1);

  const hasValue = value.length > 0;
  const isActive = focused || hasValue;

  useEffect(() => {
    focusProgress.value = withTiming(focused ? 1 : 0, { duration: 250 });
  }, [focused]);

  useEffect(() => {
    labelProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const handleFocus = () => {
    setFocused(true);
    iconScale.value = withSpring(1.15, { damping: 8 });
    setTimeout(() => {
      iconScale.value = withSpring(1, { damping: 10 });
    }, 150);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  // Container animated style
  const containerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [isDark ? '#22252D' : '#E8EAF0', accentColor],
    );
    return {
      borderColor,
      transform: [{ scale: interpolate(focusProgress.value, [0, 1], [1, 1.008]) }],
      shadowOpacity: interpolate(focusProgress.value, [0, 1], [0.03, 0.12]),
      shadowRadius: interpolate(focusProgress.value, [0, 1], [4, 16]),
    };
  });

  // Floating label style
  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(labelProgress.value, [0, 1], [0, -30]) },
      { scale: interpolate(labelProgress.value, [0, 1], [1, 0.8]) },
    ],
    opacity: interpolate(labelProgress.value, [0, 0.5, 1], [0.5, 0.7, 1]),
  }));

  // Icon background style
  const iconBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [isDark ? '#1E2028' : '#EEF0F6', accentColor + '15'],
    ),
    transform: [{ scale: iconScale.value }],
  }));

  // Glow line at bottom
  const glowStyle = useAnimatedStyle(() => ({
    opacity: focusProgress.value,
    transform: [{ scaleX: interpolate(focusProgress.value, [0, 1], [0, 1]) }],
  }));

  return (
    <AnimatedView
      entering={FadeInDown.delay(delay).duration(450).springify()}
      style={[
        {
          borderRadius: 18, borderWidth: 1.5,
          backgroundColor: isDark ? '#14171E' : '#FAFAFD',
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 4 },
          elevation: focused ? 6 : 1,
        },
        containerStyle,
      ]}
    >
      {/* Inner content */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingLeft: 14, paddingRight: 14,
        minHeight: 58,
      }}>
        {/* Animated icon with background */}
        <AnimatedView
          style={[
            {
              width: 36, height: 36, borderRadius: 10,
              alignItems: 'center', justifyContent: 'center',
              marginRight: 12,
            },
            iconBgStyle,
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={focused ? accentColor : (isDark ? '#5A5E6A' : '#9CA3AF')}
          />
        </AnimatedView>

        {/* Label + Input stacked */}
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 8 }}>
          {/* Floating label */}
          <AnimatedView
            style={[
              {
                position: 'absolute',
                left: -4, top: 18,
                pointerEvents: 'none',
                zIndex: 10,
              },
              labelStyle,
            ]}
          >
            <Animated.Text
              style={{
                fontSize: 13, fontWeight: '600',
                color: focused ? accentColor : (isDark ? '#5A5E6A' : '#9CA3AF'),
                backgroundColor: isDark ? '#14171E' : '#FAFAFD',
                paddingHorizontal: 4,
              }}
            >
              {label}
            </Animated.Text>
          </AnimatedView>

          {/* Text input */}
          <TextInput
            style={{
              fontSize: 15, fontWeight: '500',
              color: isDark ? '#ECEDF2' : '#1A1B1F',
              paddingVertical: 6,
              paddingTop: isActive ? 14 : 6,
            }}
            value={value}
            onChangeText={onChangeText}
            placeholder={isActive ? (placeholder ?? '') : ''}
            placeholderTextColor={isDark ? '#3A3E48' : '#C5C8D2'}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType ?? 'default'}
            autoCapitalize={autoCapitalize ?? 'sentences'}
            autoComplete={autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>

        {/* Password toggle / check icon */}
        {secureTextEntry ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={12}
            style={{
              width: 36, height: 36, borderRadius: 10,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: isDark ? '#1E2028' : '#EEF0F6',
              marginLeft: 8,
            }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color={isDark ? '#5A5E6A' : '#9CA3AF'}
            />
          </Pressable>
        ) : (
          hasValue && (
            <Animated.View
              entering={FadeInDown.duration(200)}
              style={{
                width: 24, height: 24, borderRadius: 12,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: accentColor + '18',
                marginLeft: 8,
              }}
            >
              <Ionicons name="checkmark" size={14} color={accentColor} />
            </Animated.View>
          )
        )}
      </View>

      {/* Bottom glow line */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, overflow: 'hidden', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
        <AnimatedView
          style={[
            {
              position: 'absolute', bottom: 0,
              left: '10%', right: '10%',
              height: 2, borderRadius: 1,
              backgroundColor: accentColor,
            },
            glowStyle,
          ]}
        />
      </View>
    </AnimatedView>
  );
}
