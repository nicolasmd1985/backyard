import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAppContext } from './AppContext';
import { useRouter } from 'expo-router';
import { validatePhotoApi } from '../services/api';
import { OutdoorValidation } from './types';

const COMMON_REGIONS = [
  'Miami, Florida',
  'Austin, Texas',
  'Los Angeles, California',
  'Denver, Colorado',
  'Bogotá, Colombia',
  'Madrid, España',
];

const BACKYARD_BEFORE_URL = 'http://localhost:3001/images/backyard_before.jpg';

function getPreviewSource(img: string | undefined) {
  if (img && typeof img === 'string') {
    if (img.startsWith('http') && !img.includes('unsplash.com')) {
      return { uri: img };
    }
    if (img.startsWith('data:') || img.startsWith('blob:')) {
      return { uri: img };
    }
  }
  return { uri: BACKYARD_BEFORE_URL };
}

export default function PhotoUploadScreen() {
  const { photos, setPhotos, setAddress, address: contextAddress } = useAppContext();
  const [images, setImages] = useState<string[]>(photos || []);
  const [address, setLocalAddress] = useState<string>(contextAddress || '');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<OutdoorValidation | null>(null);
  const router = useRouter();

  const handleNewPhoto = async (imageUri: string) => {
    const updated = [imageUri, ...images];
    setImages(updated);
    setPhotos(updated);

    // Run outdoor validation with Gemini Vision
    setIsValidating(true);
    try {
      const result = await validatePhotoApi(imageUri);
      setValidationResult(result);
    } catch (err) {
      console.warn('Validation error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const uploadFromComputer = async () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUri = event.target?.result as string;
            if (dataUri) {
              handleNewPhoto(dataUri);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    // Native mobile fallback for file picking
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const dataUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        handleNewPhoto(dataUri);
      }
    } catch (err) {
      console.warn('Error launching picker:', err);
    }
  };

  const takePhotoCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert('Camera permission is required to capture yard photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const dataUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        handleNewPhoto(dataUri);
      }
    } catch (err) {
      console.warn('Error taking photo:', err);
    }
  };

  const loadPresetSample = () => {
    // High-res real backyard sample served from backend
    const sampleUri = 'http://localhost:3001/images/backyard_before.jpg';
    handleNewPhoto(sampleUri);
  };

  const getLocationGps = async () => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied. Please select or type your region below.');
        setIsLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geo && geo.length > 0) {
        const first = geo[0];
        const parts = [first.city, first.region, first.country].filter(Boolean);
        const formatted = parts.join(', ') || 'Local Region';
        setLocalAddress(formatted);
        setAddress(formatted);
      }
    } catch (err) {
      console.warn('GPS error:', err);
      if (!address) {
        setLocalAddress('Miami, Florida');
        setAddress('Miami, Florida');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const deleteImage = (uri: string) => {
    const updated = images.filter((img) => img !== uri);
    setImages(updated);
    setPhotos(updated);
    if (updated.length === 0) {
      setValidationResult(null);
    }
  };

  const handleContinue = () => {
    const finalLocation = address.trim() || 'Miami, Florida';
    setLocalAddress(finalLocation);
    setAddress(finalLocation);
    router.push('/results');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Step Header */}
      <View style={styles.stepHeader}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 2 OF 3</Text>
        </View>
        <Text style={styles.pageTitle}>Capture & Verify Your Space</Text>
        <Text style={styles.pageSubtitle}>
          Upload a photo of your existing yard. Gemini AI will analyze the terrain and preserve your fences, boundaries, and lighting.
        </Text>
      </View>

      {/* Main Upload Area */}
      <View style={styles.uploadCard}>
        {images.length > 0 ? (
          <View style={styles.previewContainer}>
            <Image source={getPreviewSource(images[0])} style={styles.mainPreviewImage} resizeMode="cover" />
            <TouchableOpacity style={styles.removeBadge} onPress={() => deleteImage(images[0])}>
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>

            {/* Validation Pill Overlay */}
            {isValidating && (
              <View style={styles.validatingOverlay}>
                <ActivityIndicator size="small" color="#10B981" />
                <Text style={styles.validatingText}>Gemini Vision inspecting outdoor space...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.dropzone}>
            <View style={styles.dropzoneIconBox}>
              <MaterialCommunityIcons name="image-search-outline" size={38} color="#059669" />
            </View>
            <Text style={styles.dropzoneTitle}>Add Your Backyard Photo</Text>
            <Text style={styles.dropzoneDesc}>
              Upload a JPG or PNG from your computer, take a photo with your camera, or use our test yard.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonGrid}>
          <TouchableOpacity style={styles.actionBtnPrimary} onPress={uploadFromComputer} activeOpacity={0.85}>
            <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnPrimaryText}>Upload File</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSecondary} onPress={takePhotoCamera} activeOpacity={0.85}>
            <Ionicons name="camera-outline" size={20} color="#059669" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnSecondaryText}>Use Camera</Text>
          </TouchableOpacity>
        </View>

        {images.length === 0 && (
          <TouchableOpacity style={styles.samplePresetBtn} onPress={loadPresetSample}>
            <Ionicons name="sparkles" size={16} color="#0D9488" style={{ marginRight: 6 }} />
            <Text style={styles.samplePresetText}>Use Sample Backyard Photo to Test</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Outdoor Verification Banner */}
      {validationResult && (
        <View
          style={[
            styles.validationBanner,
            validationResult.is_outdoor ? styles.validationBannerSuccess : styles.validationBannerWarn,
          ]}
        >
          <Ionicons
            name={validationResult.is_outdoor ? 'checkmark-circle' : 'alert-circle'}
            size={24}
            color={validationResult.is_outdoor ? '#059669' : '#D97706'}
            style={{ marginRight: 10, marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Text
                style={[
                  styles.validationTitle,
                  { color: validationResult.is_outdoor ? '#064E3B' : '#92400E' },
                ]}
              >
                {validationResult.is_outdoor ? 'Verified Outdoor Yard' : 'Unconfirmed Outdoor Space'}
              </Text>
              <View
                style={[
                  styles.tagMini,
                  { backgroundColor: validationResult.is_outdoor ? '#D1FAE5' : '#FEF3C7' },
                ]}
              >
                <Text
                  style={[
                    styles.tagMiniText,
                    { color: validationResult.is_outdoor ? '#047857' : '#B45309' },
                  ]}
                >
                  {validationResult.detected_type || 'Yard'}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.validationFeedback,
                { color: validationResult.is_outdoor ? '#047857' : '#B45309' },
              ]}
            >
              {validationResult.feedback || 'Photo verified for optimal landscaping recommendations.'}
            </Text>
          </View>
        </View>
      )}

      {/* Spatial Preservation Note */}
      <View style={styles.preservationNote}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#0D9488" style={{ marginRight: 8 }} />
        <Text style={styles.preservationText}>
          <Text style={{ fontWeight: '700' }}>Spatial Preservation Active:</Text> Nano Banana respects your yard’s existing dimensions, fences, and horizons.
        </Text>
      </View>

      {/* Location / Climate Section */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={18} color="#059669" style={{ marginRight: 6 }} />
            <Text style={styles.locationLabel}>Your Climate Zone / Location</Text>
          </View>

          <TouchableOpacity style={styles.gpsChip} onPress={getLocationGps} disabled={isLocating}>
            {isLocating ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : (
              <>
                <Ionicons name="navigate" size={14} color="#059669" style={{ marginRight: 4 }} />
                <Text style={styles.gpsChipText}>Auto GPS</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.locationInput}
          placeholder="e.g. Miami, Florida or Austin, Texas"
          placeholderTextColor="#94A3B8"
          value={address}
          onChangeText={(val) => {
            setLocalAddress(val);
            setAddress(val);
          }}
        />

        {/* Quick Region Chips */}
        <Text style={styles.quickRegionsLabel}>Popular regions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.regionsScroll}>
          {COMMON_REGIONS.map((reg, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.regionChip, address === reg && styles.regionChipActive]}
              onPress={() => {
                setLocalAddress(reg);
                setAddress(reg);
              }}
            >
              <Text
                style={[
                  styles.regionChipText,
                  address === reg && styles.regionChipTextActive,
                ]}
              >
                {reg}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleContinue}
        activeOpacity={0.88}
      >
        <FontAwesome5 name="magic" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
        <Text style={styles.generateButtonText}>Generate AI Landscape Transformation</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
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
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dropzone: {
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  dropzoneIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropzoneTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  dropzoneDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 380,
    lineHeight: 18,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
  },
  mainPreviewImage: {
    width: '100%',
    height: 260,
    borderRadius: 14,
  },
  removeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  removeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  validatingOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 8,
  },
  validatingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
  },
  actionBtnSecondaryText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '700',
  },
  samplePresetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  samplePresetText: {
    color: '#0D9488',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  validationBanner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  validationBannerSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  validationBannerWarn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  validationTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  tagMini: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagMiniText: {
    fontSize: 11,
    fontWeight: '700',
  },
  validationFeedback: {
    fontSize: 13,
    lineHeight: 18,
  },
  preservationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  preservationText: {
    fontSize: 13,
    color: '#0F766E',
    flex: 1,
    lineHeight: 18,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  gpsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  gpsChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  locationInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 12,
  },
  quickRegionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  regionsScroll: {
    flexDirection: 'row',
  },
  regionChip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  regionChipActive: {
    backgroundColor: '#059669',
  },
  regionChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  regionChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
