import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { WORKFLOW_INEFFICIENCIES } from '@/constants/config';

const SEVERITY_COLORS: Record<string, { text: string; bg: string; dot: string }> = {
  Critical: { text: '#b91c1c', bg: '#fee2e2', dot: Colors.error },
  High: { text: '#b45309', bg: '#fef3c7', dot: Colors.warning },
  Medium: { text: '#1d4ed8', bg: '#dbeafe', dot: '#3b82f6' },
};

export default function AnalysisScreen() {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  const workflowSteps = [
    { step: 1, label: 'Discover Jobs', icon: 'search', pain: 'Platform fragmentation' },
    { step: 2, label: 'Research Company', icon: 'business', pain: 'Scattered info' },
    { step: 3, label: 'Prepare CV/Cover', icon: 'description', pain: 'Manual repetition' },
    { step: 4, label: 'Submit Application', icon: 'send', pain: 'Form re-entry fatigue' },
    { step: 5, label: 'Wait for Response', icon: 'hourglass-empty', pain: 'Zero visibility' },
    { step: 6, label: 'Interview', icon: 'video-call', pain: 'Poor scheduling' },
    { step: 7, label: 'Receive Offer', icon: 'celebration', pain: '42-day avg. delay' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workflow Analysis</Text>
        <Text style={styles.headerSub}>Job search process inefficiencies mapped</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Workflow Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Job Search Flow</Text>
          <Text style={styles.sectionDesc}>
            Below is the standard 7-step job search workflow — with the critical pain point at each stage.
          </Text>

          <View style={styles.flowChart}>
            {workflowSteps.map((s, index) => (
              <View key={s.step} style={styles.flowItem}>
                <View style={styles.flowLeft}>
                  <View style={styles.flowIconWrap}>
                    <MaterialIcons name={s.icon as any} size={18} color={Colors.primary} />
                  </View>
                  {index < workflowSteps.length - 1 ? <View style={styles.flowLine} /> : null}
                </View>
                <View style={styles.flowContent}>
                  <View style={styles.flowRow}>
                    <Text style={styles.flowStep}>Step {s.step}</Text>
                    <Text style={styles.flowLabel}>{s.label}</Text>
                  </View>
                  <View style={styles.painTag}>
                    <MaterialIcons name="warning" size={11} color={Colors.warning} />
                    <Text style={styles.painText}>{s.pain}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Inefficiencies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Major Inefficiencies Identified</Text>
          <Text style={styles.sectionDesc}>
            {WORKFLOW_INEFFICIENCIES.length} critical bottlenecks mapped from industry data and user research.
          </Text>

          {WORKFLOW_INEFFICIENCIES.map((item) => {
            const sev = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.Medium;
            const isOpen = expanded === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.infoCard, isOpen && styles.infoCardOpen]}
                onPress={() => toggle(item.id)}
              >
                <View style={styles.infoCardHeader}>
                  <View style={[styles.severityDot, { backgroundColor: sev.dot }]} />
                  <View style={styles.infoCardTitleWrap}>
                    <Text style={styles.infoCardTitle}>{item.title}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: sev.bg }]}>
                      <Text style={[styles.severityText, { color: sev.text }]}>{item.severity}</Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name={isOpen ? 'expand-less' : 'expand-more'}
                    size={22}
                    color={Colors.textSecondary}
                  />
                </View>

                {isOpen ? (
                  <View style={styles.infoCardBody}>
                    <Text style={styles.infoDesc}>{item.description}</Text>
                    <View style={styles.impactBox}>
                      <MaterialIcons name="trending-down" size={16} color={Colors.error} />
                      <Text style={styles.impactText}>{item.impact}</Text>
                    </View>
                    <View style={styles.solutionBox}>
                      <MaterialIcons name="lightbulb" size={16} color={Colors.accent} />
                      <Text style={styles.solutionText}>{item.solution}</Text>
                    </View>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Summary Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By The Numbers</Text>
          <View style={styles.statsGrid}>
            {[
              { num: '11hrs', label: 'Weekly job search time', icon: 'access-time' },
              { num: '42 days', label: 'Average time-to-hire', icon: 'calendar-today' },
              { num: '60%', label: 'Application abandonment', icon: 'person-off' },
              { num: '$4,700', label: 'Cost per hire (employer)', icon: 'attach-money' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <MaterialIcons name={stat.icon as any} size={22} color={Colors.primary} />
                <Text style={styles.statNum}>{stat.num}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  content: { paddingBottom: Spacing.xxl },
  section: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xs },
  sectionDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 20 },
  flowChart: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flowItem: { flexDirection: 'row', marginBottom: 0 },
  flowLeft: { width: 36, alignItems: 'center' },
  flowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  flowLine: { width: 2, flex: 1, backgroundColor: Colors.border, marginVertical: 2, minHeight: 16 },
  flowContent: { flex: 1, paddingLeft: Spacing.md, paddingBottom: Spacing.md },
  flowRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 3 },
  flowStep: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium, width: 40 },
  flowLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  painTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  painText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoCardOpen: { borderColor: Colors.primary },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  severityDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  infoCardTitleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  infoCardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, flex: 1 },
  severityBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  severityText: { fontSize: 11, fontWeight: FontWeight.bold },
  infoCardBody: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  infoDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.sm },
  impactBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    backgroundColor: '#fee2e2',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  impactText: { fontSize: FontSize.sm, color: '#b91c1c', flex: 1, lineHeight: 18 },
  solutionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    backgroundColor: '#e6f7f9',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  solutionText: { fontSize: FontSize.sm, color: '#0e6b75', flex: 1, lineHeight: 18 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNum: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
});
