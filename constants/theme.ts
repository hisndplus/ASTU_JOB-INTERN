// Powered by OnSpace.AI
export const Colors = {
  primary: '#0f4c75',
  primaryLight: '#1b6ca8',
  primaryDark: '#0a3254',
  accent: '#1b9aaa',
  accentLight: '#2ab5c7',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f0f4f8',
  surface: '#ffffff',
  surfaceAlt: '#e8f0f7',
  border: '#dde6ef',
  text: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  tabBar: '#0a2744',
  tabBarBorder: '#1a3a5c',
  badge: '#f59e0b',
  overlay: 'rgba(15, 76, 117, 0.08)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  hero: 30,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#0f4c75',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0f4c75',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0f4c75',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
};
