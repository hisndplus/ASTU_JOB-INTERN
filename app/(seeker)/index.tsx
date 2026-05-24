import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/feature/JobCard';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { JOB_CATEGORIES, JOB_TYPES } from '@/constants/config';

export default function BrowseJobsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { jobs, loading, fetchJobs } = useJobs();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || j.category === selectedCategory;
      const matchType = selectedType === 'All' || j.type === selectedType;
      return matchSearch && matchCat && matchType;
    });
  }, [jobs, search, selectedCategory, selectedType]);

  const featured = filtered.filter((j) => j.featured);
  const regular = filtered.filter((j) => !j.featured);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerTitle}>Find Your Dream Job</Text>
        </View>
        <View style={styles.statsChip}>
          <Text style={styles.statsNum}>{jobs.length}</Text>
          <Text style={styles.statsLabel}>Jobs</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 ? (
            <Pressable onPress={() => setSearch('')} style={styles.clearBtn}>
              <MaterialIcons name="cancel" size={18} color={Colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Type Filter */}
      <View style={styles.filterBarWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {JOB_TYPES.map((t) => (
            <Pressable
              key={t}
              style={[styles.chip, selectedType === t && styles.chipActive]}
              onPress={() => setSelectedType(t)}
            >
              <Text style={[styles.chipText, selectedType === t && styles.chipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Category Filter */}
      <View style={styles.filterBarWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {JOB_CATEGORIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.catChip, selectedCategory === c && styles.catChipActive]}
              onPress={() => setSelectedCategory(c)}
            >
              <Text style={[styles.catChipText, selectedCategory === c && styles.catChipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push({ pathname: '/job-detail', params: { id: item.id } })}
            />
          )}
          ListHeaderComponent={
            filtered.length > 0 ? (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                  {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                  {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
                </Text>
                {featured.length > 0 ? (
                  <View style={styles.featuredBadge}>
                    <MaterialIcons name="star" size={12} color={Colors.warning} />
                    <Text style={styles.featuredBadgeText}>{featured.length} Featured</Text>
                  </View>
                ) : null}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialIcons name="search-off" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No jobs found</Text>
              <Text style={styles.emptyDesc}>Try adjusting your search or filters</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
  },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  statsChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minWidth: 56,
  },
  statsNum: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#fff' },
  statsLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  searchRow: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingRight: Spacing.sm,
  },
  searchIcon: { marginLeft: Spacing.md },
  searchInput: { flex: 1, paddingHorizontal: Spacing.sm, paddingVertical: 12, fontSize: FontSize.md, color: Colors.text },
  clearBtn: { padding: Spacing.xs },
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
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  catChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  catChipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  catChipTextActive: { color: '#fff' },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  resultsText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  featuredBadgeText: { fontSize: FontSize.xs, color: Colors.warning, fontWeight: FontWeight.semibold },
  listContent: { paddingBottom: Spacing.xl },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
});
