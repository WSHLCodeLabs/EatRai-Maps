/**
 * Theme configuration for EatRai Maps
 * Dark mode restaurant finder with neon green accents
 */

import { Platform } from 'react-native';

// Primary accent color - Neon Green
const neonGreen = '#7CEB00';

// Dark theme color palette
const deepBlack = '#0D0D0D';
const darkGray = '#1A1A1A';
const mediumGray = '#2A2A2A';
const lightGray = '#8A8A8A';

export const Colors = {
  // Accent colors
  primary: neonGreen,
  neonGreen,

  // Background colors
  deepBlack,
  darkGray,
  mediumGray,

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: lightGray,
  textMuted: '#5A5A5A',

  light: {
    text: '#FFFFFF',
    background: deepBlack,
    tint: neonGreen,
    icon: lightGray,
    tabIconDefault: lightGray,
    tabIconSelected: neonGreen,
    card: darkGray,
    border: mediumGray,
  },
  dark: {
    text: '#FFFFFF',
    background: deepBlack,
    tint: neonGreen,
    icon: lightGray,
    tabIconDefault: lightGray,
    tabIconSelected: neonGreen,
    card: darkGray,
    border: mediumGray,
  },
};

// Glow effect for neon elements
export const NeonGlow = {
  shadowColor: neonGreen,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius: 12,
  elevation: 8,
};

// Subtle glow for secondary elements
export const SubtleGlow = {
  shadowColor: neonGreen,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 4,
};

// Card shadow for glassmorphism effect
export const CardShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
