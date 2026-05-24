import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { Job } from '@/services/mockData';
import { Badge } from '@/components/ui/Badge';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

const typeVariant: Record<string, any> = {
  'Full-time': 'primary',
  'Part-time': 'accent',
  Internship: 'warning',
  Contract: 'neutral',
  Remote: 'success',
};

export function JobCard({ job, onPress }: JobCardProps) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {job.featured ? (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>{job.companyLogo}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.company} numberOfLines={1}>{job.company}</Text>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
        </View>
        {job.remote ? (
          <View style={styles.remoteIcon}>
            <MaterialIcons name="wifi" size={16} color={Colors.success} />
          </View>
        ) : null}
      </View>

      <View style={styles.tags}>
        <Badge label={job.type} variant={typeVariant[job.type] || 'neutral'} />
        <Badge label={job.category} variant="neutral" />
        <Badge label={job.experience} variant="neutral" />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <MaterialIcons name="location-on" size={14} color={Colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>{job.location}</Text>
        </View>
        <View style={styles.footerRight}>
          <MaterialIcons name="people" size={14} color={Colors.textMuted} />
          <Text style={styles.applicants}>{job.applicantsCount}</Text>
          <Text style={styles.dotSep}>·</Text>
          <Text style={styles.date}>{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</Text>
        </View>
      </View>

      <View style={styles.salaryRow}>
        <MaterialIcons name="payments" size={15} color={Colors.accent} />
        <Text style={styles.salary}>{job.salary}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  featuredBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderTopRightRadius: Radius.lg,
    borderBottomLeftRadius: Radius.md,
  },
  featuredText: { fontSize: 10, fontWeight: FontWeight.bold, color: '#fff' },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  headerInfo: { flex: 1, paddingRight: Spacing.sm },
  company: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 2 },
  title: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, lineHeight: 22 },
  remoteIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  footerRight: { flexDirection: 'row', alignItems: 'center' },
  location: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 2, flex: 1 },
  applicants: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 2 },
  dotSep: { fontSize: FontSize.xs, color: Colors.textMuted, marginHorizontal: 3 },
  date: { fontSize: FontSize.xs, color: Colors.textMuted },
  salaryRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
  salary: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
    marginLeft: Spacing.xs,
  },
});
