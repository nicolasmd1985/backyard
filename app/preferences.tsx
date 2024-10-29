import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';

export default function BackyardTransformationScreen() {
  const { setPreferences } = useAppContext();
  const [mainImage, setMainImage] = useState(require('../assets/images/foodGarden.jpg'));
  const navigation = useNavigation();

  const images = {
    foodGarden: require('../assets/images/foodGarden.jpg'),
    ecoFriendly: require('../assets/images/ecoFriendly.jpg'),
    mixed: require('../assets/images/mixed.jpg'),
  };

  const handleOptionPress = (option) => {
    setMainImage(images[option]);
    setPreferences(option); // Save the selected preference to context
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Backyard Transformation</Text>

      <Image source={mainImage} style={styles.mainImage} />

      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={() => handleOptionPress('foodGarden')}>
          <Image source={images.foodGarden} style={styles.thumbnail} />
          <Text style={styles.optionText}>Food Garden</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOptionPress('ecoFriendly')}>
          <Image source={images.ecoFriendly} style={styles.thumbnail} />
          <Text style={styles.optionText}>Eco-Friendly</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOptionPress('mixed')}>
          <Image source={images.mixed} style={styles.thumbnail} />
          <Text style={styles.optionText}>Mixed</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={() => navigation.navigate('uploads')} // Navigate to uploads screen
          color="#4CAF50"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mainImage: {
    width: '90%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    width: '90%',
    marginTop: 30,
  },
});