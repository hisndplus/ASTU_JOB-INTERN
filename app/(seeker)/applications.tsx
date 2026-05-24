import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useJobs';
import { ApplicationCard } from '@/components/feature/ApplicationCard';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

const STATUS_STATS = [
  { key: 'Pending', icon: 'schedule', color: Colors.textMuted, bg: Colors.surfaceAlt },
  { key: 'Reviewed', icon: 'visibility', color: '#b45309', bg: '#fef3c7' },
  { key: 'Interview', icon: 'video-call', color: '#6d28d9', bg: '#ede9fe' },
  { key: 'Offer', icon: 'check-circle', color: '#15803d', bg: '#dcfce7' },
];

export default function ApplicationsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { applications, loading, fetchApplications } = useApplications();

  useEffect(() => {
    if (user) fetchApplications(user.id);
  }, [user]);

  const stats = STATUS_STATS.map((s) => ({
    ...s,
    count: applications.filter((a) => a.status === s.key).length,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSub}>{applications.length} total</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.key} style={[styles.statCard, { backgroundColor: s.bg }]}>
            <MaterialIcons name={s.icon as any} size={20} color={s.color} />
            <Text style={[styles.statNum, { color: s.color }]}>{s.count}</Text>
            <Text style={[styles.statLabel, { color: s.color }]}>{s.key}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ApplicationCard application={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="assignment-late" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No applications yet</Text>
              <Text style={styles.emptyDesc}>Browse jobs and submit your first application</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statNum: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  statLabel: { fontSize: 10, fontWeight: FontWeight.medium },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: Spacing.md, paddingTop: Spacing.sm },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
});
