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
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { UserRole } from '@/services/authService';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup() {
    if (!selectedRole) { setError('Please select your role to continue.'); return; }
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (selectedRole === 'employer' && !company.trim()) { setError('Please enter your company name.'); return; }

    setLoading(true);
    setError('');
    try {
      await register(name.trim(), email.trim(), password, selectedRole, company.trim() || undefined);
      if (selectedRole === 'employer') {
        router.replace('/(employer)');
      } else {
        router.replace('/(seeker)');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <View style={styles.logoMark}>
            <MaterialIcons name="work" size={22} color="#fff" />
          </View>
          <Text style={styles.brandName}>CareerBridge</Text>
        </View>

        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subheading}>Join thousands finding their next opportunity</Text>

        {/* Role Selection */}
        <Text style={styles.sectionLabel}>I am a...</Text>
        <View style={styles.roleRow}>
          <Pressable
            style={[styles.roleCard, selectedRole === 'seeker' && styles.roleCardActive]}
            onPress={() => { setSelectedRole('seeker'); setError(''); }}
          >
            <View style={[styles.roleIcon, selectedRole === 'seeker' && styles.roleIconActive]}>
              <MaterialIcons
                name="person-search"
                size={28}
                color={selectedRole === 'seeker' ? '#fff' : Colors.primary}
              />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'seeker' && styles.roleTitleActive]}>
              Job Seeker
            </Text>
            <Text style={[styles.roleDesc, selectedRole === 'seeker' && styles.roleDescActive]}>
              Browse jobs & internships, apply and track applications
            </Text>
            {selectedRole === 'seeker' ? (
              <View style={styles.roleCheck}>
                <MaterialIcons name="check-circle" size={18} color={Colors.accent} />
              </View>
            ) : null}
          </Pressable>

          <Pressable
            style={[styles.roleCard, selectedRole === 'employer' && styles.roleCardActive]}
            onPress={() => { setSelectedRole('employer'); setError(''); }}
          >
            <View style={[styles.roleIcon, selectedRole === 'employer' && styles.roleIconActive]}>
              <MaterialIcons
                name="business"
                size={28}
                color={selectedRole === 'employer' ? '#fff' : Colors.primary}
              />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'employer' && styles.roleTitleActive]}>
              Job Poster
            </Text>
            <Text style={[styles.roleDesc, selectedRole === 'employer' && styles.roleDescActive]}>
              Post openings, manage listings, and review applicants
            </Text>
            {selectedRole === 'employer' ? (
              <View style={styles.roleCheck}>
                <MaterialIcons name="check-circle" size={18} color={Colors.accent} />
              </View>
            ) : null}
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="person" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {selectedRole === 'employer' ? (
            <View style={styles.field}>
              <Text style={styles.label}>Company Name</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="business" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your company name"
                  placeholderTextColor={Colors.textMuted}
                  value={company}
                  onChangeText={setCompany}
                />
              </View>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="email" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputPassword]}
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={18} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            label="Create Account"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/auth/login" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  brandName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary },
  heading: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xs },
  subheading: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.lg },
  sectionLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.sm },
  roleRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadow.sm,
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: '#f0f6ff' },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  roleIconActive: { backgroundColor: Colors.primary },
  roleTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xs },
  roleTitleActive: { color: Colors.primary },
  roleDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  roleDescActive: { color: Colors.primaryLight },
  roleCheck: { position: 'absolute', top: Spacing.sm, right: Spacing.sm },
  form: { gap: Spacing.xs },
  field: { marginBottom: Spacing.sm },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text, marginBottom: Spacing.xs },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  inputIcon: { marginLeft: Spacing.md },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 13,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  inputPassword: { paddingRight: 0 },
  eyeBtn: { padding: Spacing.md },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  submitBtn: { marginTop: Spacing.sm },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.lg },
  loginText: { fontSize: FontSize.md, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.primary },
});
