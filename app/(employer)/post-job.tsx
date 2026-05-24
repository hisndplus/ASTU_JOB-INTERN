import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { JOB_CATEGORIES, JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants/config';

export default function PostJobScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { postJob } = useJobs();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedType, setSelectedType] = useState('Full-time');
  const [selectedCategory, setSelectedCategory] = useState('Technology');
  const [selectedExp, setSelectedExp] = useState('Mid Level');
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePost() {
    if (!title.trim()) { setError('Job title is required.'); return; }
    if (!location.trim()) { setError('Location is required.'); return; }
    if (!description.trim()) { setError('Job description is required.'); return; }
    if (!salary.trim()) { setError('Salary range is required.'); return; }

    setLoading(true);
    setError('');
    try {
      await postJob({
        title: title.trim(),
        company: user?.company || user?.name || 'My Company',
        companyLogo: (user?.company || user?.name || 'MY').slice(0, 2).toUpperCase(),
        location: location.trim(),
        type: selectedType,
        category: selectedCategory,
        salary: salary.trim(),
        description: description.trim(),
        requirements: requirements.split('\n').filter((r) => r.trim()).map((r) => r.trim()),
        deadline: deadline.trim() || '2026-07-31',
        experience: selectedExp,
        remote: isRemote,
        employerId: user?.id || 'emp',
        featured: false,
      });
      Alert.alert('Posted!', 'Your job listing is now live.', [
        { text: 'View Listings', onPress: () => router.push('/(employer)') },
      ]);
      // Reset
      setTitle(''); setLocation(''); setSalary(''); setDescription(''); setRequirements(''); setDeadline('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post a Job</Text>
          <Text style={styles.headerSub}>Fill in the details to attract top candidates</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Job Title *</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="work" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Senior Software Engineer"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Location *</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="location-on" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, State / Remote"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Salary Range *</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="payments" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={salary}
                  onChangeText={setSalary}
                  placeholder="e.g. $80,000 – $100,000"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Application Deadline</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="event" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={deadline}
                  onChangeText={setDeadline}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            {/* Remote Toggle */}
            <Pressable style={styles.toggleRow} onPress={() => setIsRemote(!isRemote)}>
              <View>
                <Text style={styles.toggleLabel}>Remote Position</Text>
                <Text style={styles.toggleDesc}>Allow candidates to work from anywhere</Text>
              </View>
              <View style={[styles.toggle, isRemote && styles.toggleOn]}>
                <View style={[styles.toggleThumb, isRemote && styles.toggleThumbOn]} />
              </View>
            </Pressable>
          </View>

          {/* Job Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Type</Text>
            <View style={styles.chipGrid}>
              {JOB_TYPES.filter((t) => t !== 'All').map((t) => (
                <Pressable
                  key={t}
                  style={[styles.chip, selectedType === t && styles.chipActive]}
                  onPress={() => setSelectedType(t)}
                >
                  <Text style={[styles.chipText, selectedType === t && styles.chipTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.chipGrid}>
              {JOB_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <Pressable
                  key={c}
                  style={[styles.chip, selectedCategory === c && styles.chipAccentActive]}
                  onPress={() => setSelectedCategory(c)}
                >
                  <Text style={[styles.chipText, selectedCategory === c && styles.chipTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Experience */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience Level</Text>
            <View style={styles.chipGrid}>
              {EXPERIENCE_LEVELS.map((e) => (
                <Pressable
                  key={e}
                  style={[styles.chip, selectedExp === e && styles.chipActive]}
                  onPress={() => setSelectedExp(e)}
                >
                  <Text style={[styles.chipText, selectedExp === e && styles.chipTextActive]}>{e}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Job Description *</Text>
              <TextInput
                style={[styles.inputBare, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Requirements (one per line)</Text>
              <TextInput
                style={[styles.inputBare, styles.textArea]}
                value={requirements}
                onChangeText={setRequirements}
                placeholder={"3+ years of experience\nStrong TypeScript skills\nRemote-first mindset"}
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            label="Publish Job Listing"
            onPress={handlePost}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { paddingBottom: Spacing.xxl },
  section: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  field: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text, marginBottom: Spacing.xs },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputIcon: { marginLeft: Spacing.md },
  input: { flex: 1, paddingHorizontal: Spacing.sm, paddingVertical: 12, fontSize: FontSize.md, color: Colors.text },
  inputBare: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  textArea: { height: 120 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  toggleLabel: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.text },
  toggleDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    padding: 2,
  },
  toggleOn: { backgroundColor: Colors.accent },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    ...Shadow.sm,
  },
  toggleThumbOn: { transform: [{ translateX: 20 }] },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipAccentActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  chipTextActive: { color: '#fff' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  submitBtn: { marginHorizontal: Spacing.md, marginTop: Spacing.md },
});
