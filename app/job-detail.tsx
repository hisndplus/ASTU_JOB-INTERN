import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getJobById } from '@/services/jobService';
import { useApplications } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { Job } from '@/services/mockData';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { apply } = useApplications();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getJobById(id).then((j) => { setJob(j); setLoading(false); });
    }
  }, [id]);

  async function handleApply() {
    if (!user || !job) return;
    if (!coverLetter.trim()) { Alert.alert('Missing', 'Please write a cover letter.'); return; }
    const resumeName = user.resumeName || 'MyResume.pdf';

    setSubmitting(true);
    try {
      await apply(user.id, user.name, user.email, job, coverLetter, resumeName);
      setShowApplyModal(false);
      Alert.alert('Applied!', `Your application to ${job.company} has been submitted.`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.loadingCenter}>
        <Text style={styles.notFoundText}>Job not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroLogo}>
            <Text style={styles.heroLogoText}>{job.companyLogo}</Text>
          </View>
          <Text style={styles.heroTitle}>{job.title}</Text>
          <Text style={styles.heroCompany}>{job.company}</Text>
          <View style={styles.heroBadges}>
            <Badge label={job.type} variant="primary" size="md" />
            <Badge label={job.category} variant="accent" size="md" />
            {job.remote ? <Badge label="Remote OK" variant="success" size="md" /> : null}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'location-on', value: job.location },
            { icon: 'payments', value: job.salary },
            { icon: 'people', value: `${job.applicantsCount} Applied` },
            { icon: 'work-outline', value: job.experience },
          ].map((stat) => (
            <View key={stat.icon} style={styles.statItem}>
              <MaterialIcons name={stat.icon as any} size={16} color={Colors.accent} />
              <Text style={styles.statValue} numberOfLines={1}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Role</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((req, i) => (
            <View key={i} style={styles.reqItem}>
              <View style={styles.reqDot} />
              <Text style={styles.reqText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Deadline */}
        <View style={styles.deadlineBox}>
          <MaterialIcons name="event" size={16} color={Colors.warning} />
          <Text style={styles.deadlineText}>Application deadline: {job.deadline}</Text>
        </View>
      </ScrollView>

      {user?.role === 'seeker' ? (
        <View style={styles.applyBar}>
          <View style={styles.applyBarInfo}>
            <Text style={styles.applyBarSalary}>{job.salary}</Text>
            <Text style={styles.applyBarType}>{job.type}</Text>
          </View>
          <Button
            label="Apply Now"
            onPress={() => setShowApplyModal(true)}
            size="md"
            style={styles.applyBtn}
          />
        </View>
      ) : null}

      <Modal visible={showApplyModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Apply to {job.company}</Text>
              <Text style={styles.modalSub}>Applying for: {job.title}</Text>

              <Text style={styles.modalLabel}>Cover Letter *</Text>
              <TextInput
                style={styles.coverInput}
                value={coverLetter}
                onChangeText={setCoverLetter}
                placeholder="Introduce yourself and explain why you are a great fit for this role..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <View style={styles.resumeNotice}>
                <MaterialIcons name="description" size={16} color={Colors.primary} />
                <Text style={styles.resumeNoticeText}>
                  Resume: {user?.resumeName || 'No resume uploaded. Upload from Profile tab.'}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <Button label="Cancel" onPress={() => setShowApplyModal(false)} variant="outline" style={{ flex: 1 }} />
                <Button label="Submit" onPress={handleApply} loading={submitting} style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  notFoundText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  content: { paddingBottom: 100 },
  hero: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  heroLogo: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroLogoText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#fff' },
  heroTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff', textAlign: 'center' },
  heroCompany: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  heroBadges: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  statsRow: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, width: '45%' },
  statValue: { fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium, flex: 1 },
  section: { padding: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  description: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
  reqItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm, gap: Spacing.sm },
  reqDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent, marginTop: 7 },
  reqText: { fontSize: FontSize.md, color: Colors.textSecondary, flex: 1, lineHeight: 22 },
  deadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginHorizontal: Spacing.md,
    backgroundColor: '#fef3c7',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  deadlineText: { fontSize: FontSize.sm, color: '#b45309', fontWeight: FontWeight.medium },
  applyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.md,
  },
  applyBarInfo: { flex: 1 },
  applyBarSalary: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  applyBarType: { fontSize: FontSize.sm, color: Colors.textSecondary },
  applyBtn: { minWidth: 120 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  modalSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  modalLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text, marginBottom: Spacing.xs },
  coverInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    height: 140,
    marginBottom: Spacing.sm,
  },
  resumeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.overlay,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  resumeNoticeText: { fontSize: FontSize.sm, color: Colors.primary, flex: 1 },
  modalActions: { flexDirection: 'row', gap: Spacing.sm },
});
