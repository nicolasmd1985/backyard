import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../src/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function PhotoUploadScreen() {
  const { setPhotos, setAddress } = useAppContext();
  const [images, setImages] = useState([]);
  const [address, setLocalAddress] = useState('');
  const router = useRouter();

  useEffect(() => {
    getLocation(); // Automatically get GPS location when the component mounts
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (cameraPermission.status !== 'granted') {
        alert('Camera permission is required to take photos');
      }
      if (libraryPermission.status !== 'granted') {
        alert('Media library permission is required to upload photos');
      }
    })();
  }, []);

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
      setPhotos((prevPhotos) => [...prevPhotos, result.assets[0].uri]); // Save to context
    }
  };

  const takePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
      setPhotos((prevPhotos) => [...prevPhotos, result.assets[0].uri]); // Save to context
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    const [geoLocation] = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    const formattedAddress = `${geoLocation.street || ''} ${geoLocation.city || ''}, ${geoLocation.region || ''}, ${geoLocation.country || ''}`;
    setLocalAddress(formattedAddress);
    setAddress(formattedAddress); // Save to context
  };

  const deleteImage = (uri) => {
    setImages(images.filter((image) => image !== uri));
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== uri)); // Remove from context as well
  };

  const handleContinue = () => {
    router.push('/results'); // Navigate to the results screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload or Capture Your Backyard Photos</Text>

      {/* Photo Upload and Display */}
      <View style={styles.flatList}>
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item)}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.imageList}
          contentContainerStyle={styles.imageListContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>


      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <FontAwesome name="photo" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Ionicons name="camera" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centeredButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Ionicons name="location" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Get GPS Location</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.locationTextInput}
        placeholder="Location not yet set"
        value={address ? `Approximate Address: ${address}` : ''}
        editable={false}
        multiline={true}
        textAlignVertical="top"
      />

      {/* Continue Button to Navigate to Results */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <FontAwesome name="arrow-right" size={20} color="#FFF" style={styles.icon} />
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  flatList: {
    marginBottom: 20,
  },
  imageList: {
    flexGrow: 0,
  },
  imageListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  centeredButtonContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  locationTextInput: {
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    textAlignVertical: 'top',
    minHeight: 70,
    marginBottom: 20,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
