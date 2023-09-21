import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';

export default function MapScreen({ navigation }) {
  const [locations, setLocations] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const options = ['Opción 1', 'Opción 2', 'Opción 3'];

  useEffect(() => {
    const getLocations = async () => {
      const fetchedLocations = await fetchLocationsFromFirestore();
      setLocations(fetchedLocations);
    };

    getLocations();
  }, []);

  const fetchLocationsFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, "Detections"));
    const locations = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      locations.push({
        title: data.title,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        description: data.description,
      });
    });
    return locations;
  };

  const onRegionChange = (region) => {
    console.log(region);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text>☰</Text>
        </TouchableOpacity>

        {/* Menú desplegable */}
        {isOpen && (
          <View style={styles.menu}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => console.log(`${option} seleccionada`)}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <MapView
        style={styles.map}
        onRegionChange={onRegionChange}
        initialRegion={{
          latitude: -11.969071010202395,
          latitudeDelta: 1.5772551319534536,
          longitude: -76.90717739984393,
          longitudeDelta: 0.9701124206185341,
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={location.location}
            title={location.title}
            description={location.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    width: '100%',
    height: '100%',
  },

  dropdownContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
});

