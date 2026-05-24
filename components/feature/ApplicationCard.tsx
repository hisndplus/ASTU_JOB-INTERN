import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { Application } from '@/services/mockData';
import { Badge } from '@/components/ui/Badge';

interface ApplicationCardProps {
  application: Application;
}

const statusConfig: Record<string, { variant: any; icon: string }> = {
  Pending: { variant: 'neutral', icon: 'schedule' },
  Reviewed: { variant: 'warning', icon: 'visibility' },
  Interview: { variant: 'interview', icon: 'video-call' },
  Offer: { variant: 'success', icon: 'check-circle' },
  Rejected: { variant: 'error', icon: 'cancel' },
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const config = statusConfig[application.status] || statusConfig.Pending;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>{application.company.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{application.jobTitle}</Text>
          <Text style={styles.company} numberOfLines={1}>{application.company}</Text>
        </View>
        <Badge label={application.status} variant={config.variant} size="md" />
      </View>
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <MaterialIcons name="calendar-today" size={13} color={Colors.textMuted} />
          <Text style={styles.footerText}>Applied {application.appliedDate}</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialIcons name="description" size={13} color={Colors.textMuted} />
          <Text style={styles.footerText}>{application.resumeName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  info: { flex: 1, marginRight: Spacing.sm },
  title: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  company: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  footer: { flexDirection: 'row', gap: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  footerText: { fontSize: FontSize.xs, color: Colors.textMuted },
});
