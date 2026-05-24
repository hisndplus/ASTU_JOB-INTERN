import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(user?.title || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState((user?.skills || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [resumeName, setResumeName] = useState(user?.resumeName || '');

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        title,
        location,
        bio,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        resumeName: resumeName || undefined,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleUploadResume() {
    const mockName = `${user?.name?.replace(/\s+/g, '_')}_Resume_2026.pdf`;
    setResumeName(mockName);
    Alert.alert('Resume Uploaded', `"${mockName}" uploaded successfully.`);
  }

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/signup');
        },
      },
    ]);
  }

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Pressable
          style={styles.editBtn}
          onPress={() => (editing ? handleSave() : setEditing(true))}
        >
          <MaterialIcons name={editing ? 'check' : 'edit'} size={18} color="#fff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <MaterialIcons name="person-search" size={14} color={Colors.accent} />
            <Text style={styles.roleText}>Job Seeker</Text>
          </View>
        </View>

        {/* Resume Upload */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resume / CV</Text>
          {resumeName ? (
            <View style={styles.resumeRow}>
              <View style={styles.resumeFile}>
                <MaterialIcons name="picture-as-pdf" size={24} color={Colors.error} />
                <View style={styles.resumeInfo}>
                  <Text style={styles.resumeName}>{resumeName}</Text>
                  <Text style={styles.resumeSub}>Uploaded</Text>
                </View>
              </View>
              <Pressable onPress={handleUploadResume} style={styles.reuploadBtn}>
                <Text style={styles.reuploadText}>Replace</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.uploadArea} onPress={handleUploadResume}>
              <MaterialIcons name="cloud-upload" size={36} color={Colors.primary} />
              <Text style={styles.uploadTitle}>Upload your Resume</Text>
              <Text style={styles.uploadDesc}>PDF, DOCX supported</Text>
            </Pressable>
          )}
        </View>

        {/* Profile Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Details</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Job Title / Role</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Software Engineer"
                placeholderTextColor={Colors.textMuted}
              />
            ) : (
              <Text style={styles.fieldValue}>{title || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Location</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
                placeholderTextColor={Colors.textMuted}
              />
            ) : (
              <Text style={styles.fieldValue}>{location || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>
            {editing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell employers about yourself..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.fieldValue}>{bio || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Skills (comma-separated)</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={skills}
                onChangeText={setSkills}
                placeholder="React Native, TypeScript, Node.js"
                placeholderTextColor={Colors.textMuted}
              />
            ) : (
              <View style={styles.skillsWrap}>
                {(user?.skills || []).length > 0 ? (
                  user?.skills?.map((skill: string) => (
                    <View key={skill} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.fieldValue}>No skills added</Text>
                )}
              </View>
            )}
          </View>

          {editing ? (
            <Button label="Save Changes" onPress={handleSave} loading={saving} fullWidth />
          ) : null}
        </View>

        {/* Sign Out */}
        <Button
          label="Sign Out"
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={styles.logoutBtn}
        />
      </ScrollView>
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
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.lg },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.md,
  },
  avatarText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  userName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  userEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    backgroundColor: '#e6f7f9',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  roleText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.accent },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  uploadArea: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: Radius.md,
    gap: Spacing.xs,
  },
  uploadTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.primary },
  uploadDesc: { fontSize: FontSize.sm, color: Colors.textMuted },
  resumeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resumeFile: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  resumeInfo: { flex: 1 },
  resumeName: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text },
  resumeSub: { fontSize: FontSize.xs, color: Colors.success },
  reuploadBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  reuploadText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.xs },
  fieldValue: { fontSize: FontSize.md, color: Colors.text },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  skillTag: {
    backgroundColor: Colors.overlay,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  skillText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  logoutBtn: { marginTop: Spacing.sm },
});
