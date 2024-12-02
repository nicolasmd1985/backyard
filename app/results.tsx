import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppContext } from './contexts/AppContext';
import axios from 'axios';
import { uploadImageToS3 } from './services/s3Uploader'; // Assuming this function is defined in s3Uploader.js

export default function ResultsScreen() {
  const { preferences, photos, address } = useAppContext();
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to upload images to S3 and fetch results from Rails
  const fetchScenario = async () => {
    setLoading(true);

    try {
      // Step 1: Upload each photo to S3 and collect URLs
      const uploadedPhotoUrls = await Promise.all(
        photos.map((photo, index) => uploadImageToS3(photo, `photo_${index}.jpg`))
      );

      // Step 2: Send data to Rails API, including location, preference, and photo URLs
      const response = await axios.post('http://44.198.230.97:3001/scenarios/generate', {
        location: address || 'Unknown Location',
        scenario_type: preferences || 'General',
        photos: uploadedPhotoUrls,
      });

      // Step 3: Store Rails response in state to display recommendations
      setAdvice({
        image: response.data.design_image || require('../assets/images/modern_backyard.jpg'),
        text: response.data.description || 'No description available.',
        plants: response.data.plants || [],
      });
    } catch (error) {
      console.error("Error fetching scenario:", error.message);
      setAdvice({
        image: 'Image not found',
        text: 'Unable to retrieve advice. Please try again later.',
        plants: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenario();
  }, [preferences, address, photos]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Backyard Transformation Results</Text>

      {/* Display Address */}
      <Text style={styles.subheaderText}>Location:</Text>
      <Text style={styles.addressText}>{address || 'Address not available'}</Text>

      {/* Display Preferences */}
      <Text style={styles.subheaderText}>Selected Preference:</Text>
      <Text style={styles.preferencesText}>{preferences || 'No preference selected'}</Text>

      {/* Display Uploaded Photos */}
      <Text style={styles.subheaderText}>Uploaded Photos:</Text>
      <ScrollView horizontal style={styles.photoContainer}>
        {photos && photos.length > 0 ? (
          photos.map((photoUri, index) => (
            <Image
              key={index}
              source={
                // plant.image_url && plant.image_url !== 'Image not found'
                photoUri !== 'Image not found'
                  ? { uri: photoUri }
                  : require('../assets/images/modern_backyard.jpg') // Fallback
              }
              style={styles.photo}
            />
          ))
        ) : (
          <Text>No photos uploaded</Text>
        )}
      </ScrollView>

      {/* Display Advice or Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        advice && (
          <>
            <Text style={styles.subheaderText}>Our Recommendation:</Text>
            <Image
              source={
                advice.image !== 'Image not found'
                  ? { uri: advice.image }
                  : require('../assets/images/modern_backyard.jpg')
              }
              style={styles.adviceImage}
            />
            <Text style={styles.adviceText}>{advice.text}</Text>

            {/* Recommended Plants */}
            {advice.plants && advice.plants.length > 0 && (
              <View style={styles.plantContainer}>
                <Text style={styles.subheaderText}>Recommended Plants:</Text>
                {advice.plants.map((plant, index) => (
                  <View key={index} style={styles.plantItem}>
                    <Image
                      style={styles.plantImage}
                      source={
                        plant.image_url && plant.image_url !== 'Image not found'
                          ? { uri: plant.image_url }
                          : require('../assets/images/modern_backyard.jpg') // Fallback
                      }
                    />
                    <View style={styles.plantInfo}>
                      <Text style={styles.plantName}>{plant.name}</Text>
                      <Text style={styles.plantDescription}>{plant.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subheaderText: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  preferencesText: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  photoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  adviceImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  adviceText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  plantContainer: {
    marginTop: 20,
    width: '100%',
  },
  plantItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  plantDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
