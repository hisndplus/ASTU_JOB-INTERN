import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useApplicants } from '@/hooks/useJobs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { Applicant } from '@/services/mockData';
import { APPLICATION_STATUSES } from '@/constants/config';

const STATUS_VARIANT: Record<string, any> = {
  Pending: 'neutral',
  Reviewed: 'warning',
  Interview: 'interview',
  Offer: 'success',
  Rejected: 'error',
};

export default function ApplicantsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { applicants, loading, fetchApplicants, updateStatus } = useApplicants();
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [filterJob, setFilterJob] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchApplicants(user.id);
  }, [user]);

  const uniqueJobs = [...new Set(applicants.map((a) => a.jobTitle))];
  const filtered = filterJob ? applicants.filter((a) => a.jobTitle === filterJob) : applicants;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applicants</Text>
        <Text style={styles.headerSub}>{applicants.length} total applications received</Text>
      </View>

      {/* Job Filter */}
      {uniqueJobs.length > 1 ? (
        <View style={styles.filterBarWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
            <Pressable
              style={[styles.chip, filterJob === null && styles.chipActive]}
              onPress={() => setFilterJob(null)}
            >
              <Text style={[styles.chipText, filterJob === null && styles.chipTextActive]}>All Jobs</Text>
            </Pressable>
            {uniqueJobs.map((j) => (
              <Pressable
                key={j}
                style={[styles.chip, filterJob === j && styles.chipActive]}
                onPress={() => setFilterJob(j)}
              >
                <Text style={[styles.chipText, filterJob === j && styles.chipTextActive]} numberOfLines={1}>{j}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.applicantCard} onPress={() => setSelected(item)}>
              <View style={styles.applicantHeader}>
                <View style={styles.avatarWrap}>
                  <Text style={styles.avatarText}>{item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
                </View>
                <View style={styles.applicantInfo}>
                  <Text style={styles.applicantName}>{item.name}</Text>
                  <Text style={styles.applicantEmail}>{item.email}</Text>
                  <Text style={styles.applicantJob} numberOfLines={1}>{item.jobTitle}</Text>
                </View>
                <Badge label={item.status} variant={STATUS_VARIANT[item.status]} />
              </View>
              <View style={styles.applicantFooter}>
                <View style={styles.footerItem}>
                  <MaterialIcons name="work-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.footerText}>{item.experience}</Text>
                </View>
                <View style={styles.footerItem}>
                  <MaterialIcons name="calendar-today" size={13} color={Colors.textMuted} />
                  <Text style={styles.footerText}>Applied {item.appliedDate}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={16} color={Colors.textMuted} />
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="people-outline" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No applicants yet</Text>
              <Text style={styles.emptyDesc}>Applications will appear here once candidates apply</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Applicant Detail Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {selected ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>
                      {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalName}>{selected.name}</Text>
                    <Text style={styles.modalEmail}>{selected.email}</Text>
                    <Badge label={selected.status} variant={STATUS_VARIANT[selected.status]} size="md" />
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Applied For</Text>
                  <Text style={styles.modalText}>{selected.jobTitle}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Experience</Text>
                  <Text style={styles.modalText}>{selected.experience}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Resume</Text>
                  <View style={styles.resumeRow}>
                    <MaterialIcons name="picture-as-pdf" size={20} color={Colors.error} />
                    <Text style={styles.modalText}>{selected.resumeName}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Cover Letter</Text>
                  <Text style={styles.coverText}>{selected.coverLetter}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Update Status</Text>
                  <View style={styles.statusGrid}>
                    {APPLICATION_STATUSES.map((s) => (
                      <Pressable
                        key={s}
                        style={[styles.statusBtn, selected.status === s && styles.statusBtnActive]}
                        onPress={() => {
                          if (user) {
                            updateStatus(user.id, selected.id, s);
                            setSelected({ ...selected, status: s });
                          }
                        }}
                      >
                        <Text style={[styles.statusBtnText, selected.status === s && styles.statusBtnTextActive]}>
                          {s}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Button label="Close" onPress={() => setSelected(null)} variant="outline" fullWidth />
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
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
  filterBarWrap: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterBar: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  chipTextActive: { color: '#fff' },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  applicantCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  applicantHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#fff' },
  applicantInfo: { flex: 1, marginRight: Spacing.sm },
  applicantName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  applicantEmail: { fontSize: FontSize.xs, color: Colors.textSecondary },
  applicantJob: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  applicantFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 },
  footerText: { fontSize: FontSize.xs, color: Colors.textMuted },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    maxHeight: '90%',
    paddingBottom: 36,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.md },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  modalAvatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#fff' },
  modalInfo: { flex: 1, gap: Spacing.xs },
  modalName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  modalEmail: { fontSize: FontSize.sm, color: Colors.textSecondary },
  modalSection: { marginBottom: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalSectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary, marginBottom: Spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  modalText: { fontSize: FontSize.md, color: Colors.text },
  resumeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  coverText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs },
  statusBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  statusBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  statusBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  statusBtnTextActive: { color: '#fff' },
});
