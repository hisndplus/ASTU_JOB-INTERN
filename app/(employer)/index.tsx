import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { Badge } from '@/components/ui/Badge';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { Job } from '@/services/mockData';

function EmployerJobCard({ job, onDelete }: { job: Job; onDelete: () => void }) {
  return (
    <View style={styles.jobCard}>
      <View style={styles.jobCardHeader}>
        <View style={styles.jobCardInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobMeta}>{job.location} · {job.type}</Text>
        </View>
        <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
          <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
        </Pressable>
      </View>
      <View style={styles.jobCardStats}>
        <View style={styles.jobStatItem}>
          <MaterialIcons name="people" size={14} color={Colors.accent} />
          <Text style={styles.jobStatText}>{job.applicantsCount} applicants</Text>
        </View>
        <View style={styles.jobStatItem}>
          <MaterialIcons name="calendar-today" size={14} color={Colors.textMuted} />
          <Text style={styles.jobStatText}>Posted {job.postedDate}</Text>
        </View>
      </View>
      <View style={styles.jobCardFooter}>
        <Badge label={job.type} variant="primary" />
        <Badge label={job.category} variant="neutral" />
        <Text style={styles.salary}>{job.salary}</Text>
      </View>
    </View>
  );
}

export default function EmployerJobsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { jobs, loading, fetchEmployerJobs, removeJob } = useJobs();
  const router = useRouter();

  useEffect(() => {
    if (user) fetchEmployerJobs(user.id);
  }, [user]);

  function handleDelete(jobId: string) {
    Alert.alert('Delete Job Posting', 'This will remove the listing permanently.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeJob(jobId) },
    ]);
  }

  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantsCount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back,</Text>
          <Text style={styles.headerTitle}>{user?.company || user?.name}</Text>
        </View>
        <Pressable style={styles.postBtn} onPress={() => router.push('/(employer)/post-job')}>
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.postBtnText}>Post Job</Text>
        </Pressable>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Active Listings', value: jobs.length, icon: 'work', color: Colors.primary },
          { label: 'Total Applicants', value: totalApplicants, icon: 'people', color: Colors.accent },
          { label: 'Interviews', value: 0, icon: 'video-call', color: '#6d28d9' },
        ].map((s) => (
          <View key={s.label} style={styles.summaryCard}>
            <MaterialIcons name={s.icon as any} size={20} color={s.color} />
            <Text style={[styles.summaryNum, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmployerJobCard job={item} onDelete={() => handleDelete(item.id)} />
          )}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              {jobs.length > 0 ? `${jobs.length} active listing${jobs.length !== 1 ? 's' : ''}` : ''}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="work-off" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No job postings yet</Text>
              <Text style={styles.emptyDesc}>Tap "Post Job" to create your first listing</Text>
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
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerGreeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  postBtnText: { color: '#fff', fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  summaryRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  summaryNum: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  summaryLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  listHeader: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  listContent: { paddingBottom: Spacing.xl },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  jobCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  jobCardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  jobCardInfo: { flex: 1 },
  jobTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  jobMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  deleteBtn: { padding: Spacing.xs },
  jobCardStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  jobStatItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  jobStatText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  jobCardFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  salary: { marginLeft: 'auto', fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.accent },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
});
