import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <ImageBackground
        source={require('../assets/images/modern_backyard.jpg')}
        style={styles.heroBackground}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay}>
          {/* Top Brand Header */}
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="leaf" size={20} color="#10B981" />
            </View>
            <Text style={styles.brandTitle}>BACKYARD<Text style={styles.brandHighlight}> AI</Text></Text>
          </View>

          {/* Hero Headlines */}
          <View style={styles.heroTextContainer}>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>POWERED BY GEMINI & NANO BANANA</Text>
            </View>

            <Text style={styles.heroTitle}>
              Reimagine Your Outdoors with Generative AI
            </Text>

            <Text style={styles.heroSubtitle}>
              Capture a photo of your yard, choose your garden philosophy, and watch AI design a stunning, climate-adapted landscape in seconds.
            </Text>

            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => router.push('/preferences')}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryCtaText}>Start Transformation</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.ctaIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Feature Value Propositions */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresSectionTitle}>How Backyard AI Works</Text>
        <Text style={styles.featuresSectionSubtitle}>
          Scientific climate adaptation meets photorealistic architectural landscape rendering.
        </Text>

        <View style={styles.featuresGrid}>
          {/* Card 1 */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="camera-reverse" size={26} color="#059669" />
            </View>
            <Text style={styles.featureCardTitle}>1. Outdoor Smart Scanner</Text>
            <Text style={styles.featureCardDesc}>
              Upload a photo from your computer or snap your yard. Gemini Vision instantly inspects sunlight, boundaries, and soil layout.
            </Text>
          </View>

          {/* Card 2 */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="flower-tulip" size={26} color="#D97706" />
            </View>
            <Text style={styles.featureCardTitle}>2. Native Eco-Curation</Text>
            <Text style={styles.featureCardDesc}>
              Tailored botano-climatic recommendations: edible food forests, drought-tolerant pollinator sanctuaries, or hybrid balances.
            </Text>
          </View>

          {/* Card 3 */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: '#EFF6FF' }]}>
              <FontAwesome5 name="magic" size={22} color="#2563EB" />
            </View>
            <Text style={styles.featureCardTitle}>3. Nano Banana Concept</Text>
            <Text style={styles.featureCardDesc}>
              Preserves the original fences, structures, and dimensions of your home while generating lush visual plantings.
            </Text>
          </View>
        </View>

        {/* Quick Launch Card */}
        <View style={styles.quickLaunchBanner}>
          <View style={styles.quickLaunchContent}>
            <Text style={styles.quickLaunchTitle}>Ready to cultivate your dream yard?</Text>
            <Text style={styles.quickLaunchDesc}>No landscape designer fees or guesswork required.</Text>
          </View>
          <TouchableOpacity
            style={styles.quickLaunchButton}
            onPress={() => router.push('/preferences')}
            activeOpacity={0.85}
          >
            <Text style={styles.quickLaunchButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    flexGrow: 1,
  },
  heroBackground: {
    minHeight: 520,
    width: '100%',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 30, 20, 0.72)',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  brandHighlight: {
    color: '#34D399',
  },
  heroTextContainer: {
    maxWidth: 680,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 8,
  },
  statusText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 44,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 26,
    marginBottom: 28,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 10,
  },
  ctaIcon: {
    marginLeft: 4,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  featuresSectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuresSectionSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 620,
    alignSelf: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 36,
  },
  featureCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  featureIconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  featureCardDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  quickLaunchBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  quickLaunchContent: {
    flex: 1,
    minWidth: 240,
  },
  quickLaunchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickLaunchDesc: {
    fontSize: 14,
    color: '#A7F3D0',
  },
  quickLaunchButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  quickLaunchButtonText: {
    color: '#064E3B',
    fontSize: 15,
    fontWeight: '800',
  },
});
