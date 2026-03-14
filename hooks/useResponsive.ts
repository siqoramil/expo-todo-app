import { useWindowDimensions, Platform, PixelRatio } from 'react-native';

/**
 * Responsive sizing utilities based on screen dimensions.
 * Base design: 390x844 (iPhone 14 / standard mobile)
 */
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const scaleW = width / BASE_WIDTH;
  const scaleH = height / BASE_HEIGHT;
  const scale = Math.min(scaleW, scaleH);

  // Responsive width-based sizing (for horizontal elements)
  const rw = (size: number) => Math.round(size * scaleW);

  // Responsive height-based sizing (for vertical elements)
  const rh = (size: number) => Math.round(size * scaleH);

  // Responsive scaling (uses the smaller scale factor)
  const rs = (size: number) => Math.round(size * scale);

  // Font scaling with pixel ratio normalization
  const rf = (size: number) => {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  const isSmallDevice = width < 375;
  const isLargeDevice = width >= 428;
  const isTablet = width >= 768;
  const isShortDevice = height < 700;

  const tabBarHeight = Platform.select({
    ios: isSmallDevice ? 55 : 60,
    default: isSmallDevice ? 56 : 62,
  }) ?? 60;

  return {
    width,
    height,
    rw,
    rh,
    rs,
    rf,
    isSmallDevice,
    isLargeDevice,
    isTablet,
    isShortDevice,
    tabBarHeight,
  };
}
