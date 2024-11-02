import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppContext } from './AppContext';
import axios from 'axios';
import { uploadImageToS3 } from './s3Uploader'; // Assuming this function is defined in s3Uploader.js

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
      const response = await axios.post('http://192.168.1.36:3000/scenarios/generate', {
        location: address || 'Unknown Location',
        scenario_type: preferences,
        photos: uploadedPhotoUrls,
      });

      // Step 3: Store Rails response in state to display recommendations
      setAdvice({
        image: response.data.design_image,
        text: response.data.description,
      });
    } catch (error) {
      console.error("Error fetching scenario:", error);
      setAdvice({
        image: require('../assets/images/modern_backyard.jpg'), // Default image
        text: 'Unable to retrieve advice. Please try again later.',
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
      <Text style={styles.preferencesText}>{preferences}</Text>

      {/* Display Uploaded Photos */}
      <Text style={styles.subheaderText}>Uploaded Photos:</Text>
      <ScrollView horizontal style={styles.photoContainer}>
        {photos.map((photoUri, index) => (
          <Image key={index} source={{ uri: photoUri }} style={styles.photo} />
        ))}
      </ScrollView>

      {/* Display Advice or Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        advice && (
          <>
            <Text style={styles.subheaderText}>Our Recommendation:</Text>
            <Image
              source={{ uri: advice.image }}
              style={styles.adviceImage}
            />
            <Text style={styles.adviceText}>{advice.text}</Text>
          </>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
});
