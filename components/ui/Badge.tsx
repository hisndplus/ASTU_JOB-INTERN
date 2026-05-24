import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral' | 'interview';
  size?: 'sm' | 'md';
}

const variantColors: Record<string, { bg: string; text: string }> = {
  primary: { bg: Colors.overlay, text: Colors.primary },
  accent: { bg: '#e6f7f9', text: Colors.accent },
  success: { bg: '#dcfce7', text: '#15803d' },
  warning: { bg: '#fef3c7', text: '#b45309' },
  error: { bg: '#fee2e2', text: '#b91c1c' },
  neutral: { bg: Colors.surfaceAlt, text: Colors.textSecondary },
  interview: { bg: '#ede9fe', text: '#6d28d9' },
};

export function Badge({ label, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const colors = variantColors[variant] || variantColors.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, { color: colors.text }, size === 'md' && styles.textMd]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  textMd: {
    fontSize: FontSize.sm,
  },
});
