import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppContext } from './AppContext';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { generateScenarioApi } from '../services/api';
import { PlantRecommendation, ScenarioResponse } from './types';

export default function ResultsScreen() {
  const { preferences, photos, address, resetApp } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScenarioResponse | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'transformed' | 'original' | 'split'>('transformed');
  const [plantFilter, setPlantFilter] = useState<string>('all');
  const [originalFailed, setOriginalFailed] = useState(false);
  const [transformedFailed, setTransformedFailed] = useState(false);
  const router = useRouter();

  const fetchScenario = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateScenarioApi({
        location: address || 'Local Area',
        scenario_type: preferences || 'foodGarden',
        photos: photos || [],
      });
      setData(response);
    } catch (err: any) {
      console.warn('API error:', err);
      setError(err?.message || 'Failed to fetch scenario from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenario();
  }, []);

  const handleReturnHome = () => {
    resetApp();
    router.replace('/');
  };

  const getPhilosophyTitle = (key: string) => {
    switch (key) {
      case 'foodGarden':
        return 'Edible Food Garden';
      case 'ecoFriendly':
        return 'Native Eco-Friendly Sanctuary';
      case 'mixed':
        return 'Mixed Hybrid Landscape';
      default:
        return 'Custom Garden Design';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingTitle}>Cultivating Your Landscape Blueprint</Text>
          <Text style={styles.loadingSubtitle}>
            Gemini AI is analyzing climate conditions for {address || 'your region'} and generating native botanical species...
          </Text>

          <View style={styles.loadingSteps}>
            <View style={styles.loadingStepItem}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.loadingStepText}>Outdoor terrain and sunlight mapped</Text>
            </View>
            <View style={styles.loadingStepItem}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.loadingStepText}>Zero-waste native species selected</Text>
            </View>
            <View style={styles.loadingStepItem}>
              <ActivityIndicator size="small" color="#059669" style={{ width: 16, height: 16 }} />
              <Text style={styles.loadingStepText}>Rendering photorealistic concept...</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

const BACKYARD_BEFORE_URL = 'http://localhost:3001/images/backyard_before.jpg';
const FOOD_GARDEN_URL = 'http://localhost:3001/images/foodGarden.jpg';
const ECO_FRIENDLY_URL = 'http://localhost:3001/images/ecoFriendly.jpg';
const MIXED_URL = 'http://localhost:3001/images/mixed.jpg';

function getResolvedSource(img: any, fallbackUrl: string) {
  if (img && typeof img === 'string') {
    if (img.startsWith('http') && !img.includes('unsplash.com')) {
      return { uri: img };
    }
    if (img.startsWith('data:') || img.startsWith('blob:')) {
      return { uri: img };
    }
  }
  return { uri: fallbackUrl };
}

  const fallbackTransformed = preferences === 'ecoFriendly'
    ? ECO_FRIENDLY_URL
    : preferences === 'mixed'
    ? MIXED_URL
    : FOOD_GARDEN_URL;

  const originalSource = originalFailed
    ? { uri: BACKYARD_BEFORE_URL }
    : getResolvedSource(photos && photos.length > 0 ? photos[0] : data?.original_image, BACKYARD_BEFORE_URL);

  const transformedSource = transformedFailed
    ? { uri: fallbackTransformed }
    : getResolvedSource(data?.design_image, fallbackTransformed);

  // Filter plants based on user chip selection
  const filteredPlants = (data?.plants || []).filter((plant) => {
    if (plantFilter === 'all') return true;
    if (plantFilter === 'edible') return plant.category?.toLowerCase().includes('edible') || plant.category?.toLowerCase().includes('fruit');
    if (plantFilter === 'pollinator') return plant.category?.toLowerCase().includes('pollinator') || plant.category?.toLowerCase().includes('native');
    if (plantFilter === 'water') return plant.water_requirement?.toLowerCase().includes('low');
    return true;
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Top Meta Bar */}
      <View style={styles.topHeader}>
        <View style={styles.badgeRow}>
          <View style={styles.philosophyBadge}>
            <Text style={styles.philosophyBadgeText}>
              {getPhilosophyTitle(data?.scenario || preferences)}
            </Text>
          </View>

          {data?.outdoor_validation?.is_outdoor && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#059669" />
              <Text style={styles.verifiedBadgeText}>
                {data.outdoor_validation.detected_type || 'Outdoor Verified'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.pageTitle}>Your AI Landscape Transformation</Text>
        <View style={styles.locationMeta}>
          <Ionicons name="location-sharp" size={16} color="#059669" style={{ marginRight: 4 }} />
          <Text style={styles.locationText}>{data?.location || address || 'Local Region'}</Text>
        </View>
      </View>

      {/* Visual Transformation & Comparison Section */}
      <View style={styles.visualCard}>
        {/* Toggle Switch between Transformed and Original */}
        <View style={styles.comparisonToggleBar}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeImageTab === 'transformed' && styles.toggleBtnActive]}
            onPress={() => setActiveImageTab('transformed')}
          >
            <FontAwesome5
              name="magic"
              size={14}
              color={activeImageTab === 'transformed' ? '#059669' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.toggleBtnText, activeImageTab === 'transformed' && styles.toggleBtnTextActive]}>
              Transformed Concept
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeImageTab === 'original' && styles.toggleBtnActive]}
            onPress={() => setActiveImageTab('original')}
          >
            <Ionicons
              name="camera"
              size={14}
              color={activeImageTab === 'original' ? '#059669' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.toggleBtnText, activeImageTab === 'original' && styles.toggleBtnTextActive]}>
              Original Yard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeImageTab === 'split' && styles.toggleBtnActive]}
            onPress={() => setActiveImageTab('split')}
          >
            <MaterialCommunityIcons
              name="compare"
              size={16}
              color={activeImageTab === 'split' ? '#059669' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.toggleBtnText, activeImageTab === 'split' && styles.toggleBtnTextActive]}>
              Side-by-Side
            </Text>
          </TouchableOpacity>
        </View>

        {/* Display Active View */}
        {activeImageTab === 'split' ? (
          <View style={styles.splitViewContainer}>
            <View style={styles.splitCol}>
              <Image
                source={originalSource}
                style={styles.splitImage}
                resizeMode="cover"
                onError={() => setOriginalFailed(true)}
              />
              <View style={styles.imageCaptionBadge}>
                <Text style={styles.imageCaptionText}>BEFORE: Original Yard</Text>
              </View>
            </View>
            <View style={styles.splitCol}>
              <Image
                source={transformedSource}
                style={styles.splitImage}
                resizeMode="cover"
                onError={() => setTransformedFailed(true)}
              />
              <View style={[styles.imageCaptionBadge, { backgroundColor: 'rgba(5, 150, 105, 0.9)' }]}>
                <Text style={styles.imageCaptionText}>AFTER: Nano Banana Concept</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.singleImageContainer}>
            <Image
              source={activeImageTab === 'original' ? originalSource : transformedSource}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() => {
                if (activeImageTab === 'original') setOriginalFailed(true);
                else setTransformedFailed(true);
              }}
            />
            <View
              style={[
                styles.imageCaptionBadge,
                activeImageTab === 'transformed' && { backgroundColor: 'rgba(5, 150, 105, 0.9)' },
              ]}
            >
              <Text style={styles.imageCaptionText}>
                {activeImageTab === 'original' ? 'BEFORE: Current Yard' : 'AFTER: AI Landscape Vision'}
              </Text>
            </View>
          </View>
        )}

        {/* Description & Space Preservation Banner */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionHeadline}>Landscape Design Assessment:</Text>
          <Text style={styles.descriptionBody}>{data?.description}</Text>

          {data?.outdoor_validation?.feedback && (
            <View style={styles.feedbackRow}>
              <Ionicons name="sparkles" size={16} color="#059669" style={{ marginRight: 6 }} />
              <Text style={styles.feedbackText}>{data.outdoor_validation.feedback}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Recommended Plants Section */}
      <View style={styles.plantsSection}>
        <View style={styles.plantsHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Curated Plant Species for Your Zone</Text>
            <Text style={styles.sectionSubtitle}>
              Selected for seasonal climate resilience, root depth, and biodiversity.
            </Text>
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChipsRow}>
          <TouchableOpacity
            style={[styles.filterChip, plantFilter === 'all' && styles.filterChipActive]}
            onPress={() => setPlantFilter('all')}
          >
            <Text style={[styles.filterChipText, plantFilter === 'all' && styles.filterChipTextActive]}>
              All ({data?.plants?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, plantFilter === 'edible' && styles.filterChipActive]}
            onPress={() => setPlantFilter('edible')}
          >
            <Text style={[styles.filterChipText, plantFilter === 'edible' && styles.filterChipTextActive]}>
              🥗 Edibles & Herbs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, plantFilter === 'pollinator' && styles.filterChipActive]}
            onPress={() => setPlantFilter('pollinator')}
          >
            <Text style={[styles.filterChipText, plantFilter === 'pollinator' && styles.filterChipTextActive]}>
              🐝 Native & Pollinators
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, plantFilter === 'water' && styles.filterChipActive]}
            onPress={() => setPlantFilter('water')}
          >
            <Text style={[styles.filterChipText, plantFilter === 'water' && styles.filterChipTextActive]}>
              💧 Low Water
            </Text>
          </TouchableOpacity>
        </View>

        {/* Plant Cards */}
        <View style={styles.plantCardsGrid}>
          {filteredPlants.map((plant: PlantRecommendation, index: number) => (
            <View key={index} style={styles.plantCard}>
              {plant.image_url ? (
                <Image source={{ uri: plant.image_url }} style={styles.plantThumb} resizeMode="cover" />
              ) : (
                <View style={[styles.plantThumb, { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="leaf" size={28} color="#94A3B8" />
                </View>
              )}

              <View style={styles.plantDetails}>
                <View style={styles.plantNameRow}>
                  <Text style={styles.plantCommonName}>{plant.name}</Text>
                  {plant.category && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{plant.category}</Text>
                    </View>
                  )}
                </View>

                {plant.scientific_name ? (
                  <Text style={styles.plantScientificName}>{plant.scientific_name}</Text>
                ) : null}

                {/* Traits Badges */}
                <View style={styles.traitsRow}>
                  {plant.sun_requirement && (
                    <View style={styles.traitChip}>
                      <Ionicons name="sunny-outline" size={12} color="#D97706" />
                      <Text style={styles.traitText}>{plant.sun_requirement}</Text>
                    </View>
                  )}
                  {plant.water_requirement && (
                    <View style={styles.traitChip}>
                      <Ionicons name="water-outline" size={12} color="#0284C7" />
                      <Text style={styles.traitText}>{plant.water_requirement} Water</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.plantDescription}>{plant.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Footer */}
      <View style={styles.actionFooter}>
        <TouchableOpacity
          style={styles.newDesignBtn}
          onPress={() => router.push('/preferences')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="palette-swatch-outline" size={18} color="#059669" style={{ marginRight: 8 }} />
          <Text style={styles.newDesignBtnText}>Try Another Style</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={handleReturnHome}
          activeOpacity={0.85}
        >
          <Ionicons name="home" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.homeBtnText}>Return to Home</Text>
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
  loadingScreen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    maxWidth: 460,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  loadingSteps: {
    width: '100%',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  loadingStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingStepText: {
    fontSize: 13,
    color: '#475569',
  },
  topHeader: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  philosophyBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  philosophyBadgeText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  verifiedBadgeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  visualCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  comparisonToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  singleImageContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  splitViewContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 280,
    gap: 4,
    backgroundColor: '#0F172A',
  },
  splitCol: {
    flex: 1,
    position: 'relative',
  },
  splitImage: {
    width: '100%',
    height: '100%',
  },
  imageCaptionBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  imageCaptionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  descriptionBox: {
    padding: 20,
  },
  descriptionHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  descriptionBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 10,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '600',
    flex: 1,
  },
  plantsSection: {
    marginBottom: 32,
  },
  plantsHeaderRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  plantCardsGrid: {
    gap: 12,
  },
  plantCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  plantThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 14,
  },
  plantDetails: {
    flex: 1,
  },
  plantNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  plantCommonName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  plantScientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#64748B',
    marginBottom: 6,
  },
  traitsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  traitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 4,
  },
  traitText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  plantDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  actionFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  newDesignBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
  },
  newDesignBtnText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '700',
  },
  homeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
    paddingVertical: 14,
    borderRadius: 12,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
