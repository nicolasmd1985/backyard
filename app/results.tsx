import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from './AppContext';
import { FontAwesome } from '@expo/vector-icons';

export default function ResultsScreen() {
  const { preferences, photos, address } = useAppContext();

  // Placeholder advice based on the selected preference
  const generateAdvice = () => {
    switch (preferences) {
      case 'foodGarden':
        return {
          image: require('../assets/images/foodGarden.jpg'),
          text: 'Transform your backyard into a productive food garden with raised beds and herbs. This design maximizes food yield in small spaces.',
        };
      case 'ecoFriendly':
        return {
          image: require('../assets/images/ecoFriendly.jpg'),
          text: 'Create a sustainable backyard by using native plants, rain gardens, and composting areas to promote biodiversity.',
        };
      case 'mixed':
        return {
          image: require('../assets/images/mixed.jpg'),
          text: 'Blend productivity and sustainability with a mixed backyard. Include spaces for food production alongside eco-friendly designs.',
        };
      default:
        return {
          image: require('../assets/images/modern_backyard.jpg'),
          text: 'Choose your preferences to get personalized advice on transforming your backyard.',
        };
    }
  };

  const advice = generateAdvice();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Backyard Transformation Results</Text>

      {/* Display Address */}
      <Text style={styles.subheaderText}>Location:</Text>
      <Text style={styles.addressText}>{address || 'Address not available'}</Text>

      {/* Display Preference */}
      <Text style={styles.subheaderText}>Selected Preference:</Text>
      <Text style={styles.preferenceText}>{preferences}</Text>

      {/* Display Uploaded Photos */}
      <Text style={styles.subheaderText}>Uploaded Photos:</Text>
      <ScrollView horizontal style={styles.photoContainer}>
        {photos.map((photoUri, index) => (
          <Image key={index} source={{ uri: photoUri }} style={styles.photo} />
        ))}
      </ScrollView>

      {/* Display Advice */}
      <Text style={styles.subheaderText}>Our Recommendation:</Text>
      <Image source={advice.image} style={styles.adviceImage} />
      <Text style={styles.adviceText}>{advice.text}</Text>

      {/* Return to Home Button */}
      <TouchableOpacity style={styles.returnButton} onPress={() => console.log('Return to Home')}>
        <FontAwesome name="home" size={20} color="#FFF" style={styles.icon} />
        <Text style={styles.returnButtonText}>Return to Home</Text>
      </TouchableOpacity>
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
  preferenceText: {
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
  returnButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  returnButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
