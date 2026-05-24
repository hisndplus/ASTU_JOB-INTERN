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

export default function EmployerAccountScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [company, setCompany] = useState(user?.company || '');
  const [title, setTitle] = useState(user?.title || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({ company, title, location, bio });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure?', [
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

  const initials = user?.company
    ? user.company.slice(0, 2).toUpperCase()
    : user?.name?.slice(0, 2).toUpperCase() || 'CO';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Company Account</Text>
        <Pressable
          style={styles.editBtn}
          onPress={() => (editing ? handleSave() : setEditing(true))}
        >
          <MaterialIcons name={editing ? 'check' : 'edit'} size={18} color="#fff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Brand */}
        <View style={styles.brandSection}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandLogoText}>{initials}</Text>
          </View>
          <Text style={styles.brandName}>{user?.company || user?.name}</Text>
          <Text style={styles.brandEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <MaterialIcons name="business" size={14} color={Colors.accent} />
            <Text style={styles.roleText}>Job Poster / Employer</Text>
          </View>
        </View>

        {/* Company Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Company Details</Text>

          {[
            { label: 'Company Name', value: company, setter: setCompany, placeholder: 'Company name', icon: 'business' },
            { label: 'Your Title / Role', value: title, setter: setTitle, placeholder: 'e.g. HR Manager', icon: 'badge' },
            { label: 'Company Location', value: location, setter: setLocation, placeholder: 'City, Country', icon: 'location-on' },
          ].map((f) => (
            <View key={f.label} style={styles.field}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              {editing ? (
                <View style={styles.inputWrap}>
                  <MaterialIcons name={f.icon as any} size={16} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={f.value}
                    onChangeText={f.setter}
                    placeholder={f.placeholder}
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              ) : (
                <Text style={styles.fieldValue}>{f.value || 'Not set'}</Text>
              )}
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Company Description</Text>
            {editing ? (
              <TextInput
                style={[styles.inputBare, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell candidates about your company culture, mission, and values..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.fieldValue}>{bio || 'Not set'}</Text>
            )}
          </View>

          {editing ? (
            <Button label="Save Changes" onPress={handleSave} loading={saving} fullWidth />
          ) : null}
        </View>

        {/* Quick Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          {[
            { icon: 'work', label: 'View My Job Listings', action: () => router.push('/(employer)') },
            { icon: 'add-circle', label: 'Post a New Job', action: () => router.push('/(employer)/post-job') },
            { icon: 'people', label: 'Review Applicants', action: () => router.push('/(employer)/applicants') },
          ].map((item) => (
            <Pressable key={item.label} style={styles.actionRow} onPress={item.action}>
              <View style={styles.actionIcon}>
                <MaterialIcons name={item.icon as any} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Button label="Sign Out" onPress={handleLogout} variant="outline" fullWidth style={styles.logoutBtn} />
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
  brandSection: { alignItems: 'center', marginBottom: Spacing.lg },
  brandLogo: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.md,
  },
  brandLogoText: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: '#fff' },
  brandName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  brandEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
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
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.xs },
  fieldValue: { fontSize: FontSize.md, color: Colors.text },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputIcon: { marginLeft: Spacing.md },
  input: { flex: 1, paddingHorizontal: Spacing.sm, paddingVertical: 11, fontSize: FontSize.md, color: Colors.text },
  inputBare: {
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text, fontWeight: FontWeight.medium },
  logoutBtn: { marginTop: Spacing.sm },
});
