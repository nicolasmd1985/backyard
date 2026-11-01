import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from './AppContext';
import { ScenarioType } from './types';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface StyleOption {
  key: ScenarioType;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  waterLevel: string;
  maintenance: string;
  image: any;
}

const OPTIONS: StyleOption[] = [
  {
    key: 'foodGarden',
    badge: 'HARVEST & NUTRITION',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5',
    title: 'Edible Food Garden',
    tagline: 'High-yield raised beds, heirloom vegetables & fragrant kitchen herbs.',
    description: 'Designed to maximize food productivity within your available footprint. Incorporates companion planting with marigolds and basil to naturally protect crops, along with gravel pathways and rainwater collection points.',
    tags: ['Tomatoes', 'Peppers', 'Rosemary', 'Strawberries', 'Raised Cedar Beds'],
    waterLevel: 'Moderate',
    maintenance: 'Medium',
    image: require('../assets/images/foodGarden.jpg'),
  },
  {
    key: 'ecoFriendly',
    badge: 'CONSERVATION & WILDLIFE',
    badgeColor: '#0D9488',
    badgeBg: '#F0FDFA',
    title: 'Native Eco-Friendly',
    tagline: 'Resilient local wildflowers, pollinator habitats & zero-waste design.',
    description: 'Celebrates your region’s native biome. Uses drought-tolerant perennials that thrive without synthetic fertilizers, creating a living habitat for songbirds, bees, and monarch butterflies with winding natural stone pathways.',
    tags: ['Coneflower', 'Milkweed', 'Switchgrass', 'Lavender', 'Permeable Stone'],
    waterLevel: 'Very Low',
    maintenance: 'Low',
    image: require('../assets/images/ecoFriendly.jpg'),
  },
  {
    key: 'mixed',
    badge: 'BALANCED HARMONY',
    badgeColor: '#7C3AED',
    badgeBg: '#F5F3FF',
    title: 'Mixed Hybrid Landscape',
    tagline: 'The ideal fusion of productive edible patches and native ornamental beauty.',
    description: 'Artfully integrates berry bushes, herbs, and salad greens with resilient native flowers and architectural grasses. Gives you fresh homegrown food alongside effortless seasonal color and biodiversity.',
    tags: ['Blueberries', 'Culinary Sage', 'Thyme', 'Native Asters', 'Mulch Pathways'],
    waterLevel: 'Low-Moderate',
    maintenance: 'Medium-Low',
    image: require('../assets/images/mixed.jpg'),
  },
];

export default function PreferencesScreen() {
  const { preferences, setPreferences } = useAppContext();
  const [selectedKey, setSelectedKey] = useState<ScenarioType>(
    (preferences as ScenarioType) || 'foodGarden'
  );
  const router = useRouter();

  const handleSelect = (key: ScenarioType) => {
    setSelectedKey(key);
    setPreferences(key);
  };

  const selectedOption = OPTIONS.find((o) => o.key === selectedKey) || OPTIONS[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Step Header */}
      <View style={styles.stepHeader}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 1 OF 3</Text>
        </View>
        <Text style={styles.pageTitle}>Choose Your Landscape Philosophy</Text>
        <Text style={styles.pageSubtitle}>
          Select the ecological and aesthetic focus you want Gemini AI to apply to your yard.
        </Text>
      </View>

      {/* Style Option Cards */}
      <View style={styles.cardsList}>
        {OPTIONS.map((opt) => {
          const isSelected = selectedKey === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(opt.key)}
              activeOpacity={0.9}
            >
              <Image source={opt.image} style={styles.cardImage} resizeMode="cover" />

              {/* Selection Checkmark Bubble */}
              <View style={[styles.checkBubble, isSelected && styles.checkBubbleSelected]}>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={26} color="#059669" />
                ) : (
                  <View style={styles.checkEmpty} />
                )}
              </View>

              <View style={styles.cardContent}>
                <View style={[styles.cardBadge, { backgroundColor: opt.badgeBg }]}>
                  <Text style={[styles.cardBadgeText, { color: opt.badgeColor }]}>{opt.badge}</Text>
                </View>

                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardTagline}>{opt.tagline}</Text>

                {/* Key Metrics Pill Row */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Ionicons name="water-outline" size={14} color="#0284C7" />
                    <Text style={styles.metricText}>Water: <Text style={styles.metricBold}>{opt.waterLevel}</Text></Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Ionicons name="construct-outline" size={14} color="#D97706" />
                    <Text style={styles.metricText}>Care: <Text style={styles.metricBold}>{opt.maintenance}</Text></Text>
                  </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsRow}>
                  {opt.tags.map((tag, i) => (
                    <View key={i} style={styles.tagPill}>
                      <Text style={styles.tagPillText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Detail Blueprint Preview of Selected Option */}
      <View style={styles.blueprintCard}>
        <View style={styles.blueprintHeader}>
          <FontAwesome5 name="seedling" size={18} color="#059669" style={{ marginRight: 8 }} />
          <Text style={styles.blueprintTitle}>How this transforms your yard:</Text>
        </View>
        <Text style={styles.blueprintDesc}>{selectedOption.description}</Text>
      </View>

      {/* Bottom Sticky-like Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/uploads')}
          activeOpacity={0.88}
        >
          <Text style={styles.continueButtonText}>Continue with {selectedOption.title}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepBadge: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  cardsList: {
    gap: 18,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#059669',
    shadowColor: '#059669',
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  checkBubble: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkBubbleSelected: {
    borderColor: '#059669',
  },
  checkEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E0',
  },
  cardContent: {
    padding: 18,
  },
  cardBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardTagline: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#64748B',
  },
  metricBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  blueprintCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  blueprintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  blueprintTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#064E3B',
  },
  blueprintDesc: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 20,
  },
  bottomBar: {
    marginTop: 8,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});