import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import GlobalValues from '../../utils/GlobalValues.tsx';

export default function MapScreen({ navigation }) {
 const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [selectedProyectoName, setSelectedProyectoName] = useState("Selecciona un Proyecto");

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getProyectos = async () => {
        const proyectos = await fetchListFromFirestore();
        setProjects(proyectos)
      //const fetchedLocations = await fetchLocationsFromFirestore();
      //setLocations(fetchedLocations);
    };
    getProyectos();
  }, []);

  const fetchListFromFirestore = async () => {
      //console.log("entro");
      ///para pruebas
      //const querySnapshot = await getDocs(collection(db, "Proyectos"));

      const Proyecto = await getDocs(collection(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto'));

      const projects = []
      Proyecto.forEach((doc) => {
        const data = doc.data();
        console.log(doc.id);
        console.log(data.Nombre);
        projects.push({
          id: doc.id,
          name: data.Nombre,
        });
      });
      console.log(projects)
      return projects
    };

  const fetchLocationsFromFirestore = async (proyectoUid) => {
    console.log(proyectoUid)
    const querySnapshot = await getDocs(collection(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto', proyectoUid, 'Registro'));
    const locations = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

        console.log(doc.title);
        console.log(data.latitude);
        console.log(data.longitude);
        console.log(data.description);
        locations.push({
          title: data.title,
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          description: data.description,
        });
      });
    console.log(locations)
    return locations;
  };

  const onProyectoSelect = async  (proyectoData) => {
    console.log(proyectoData.id);
    setSelectedProyecto(proyectoData.id);
    GlobalValues.setProyectoUID(proyectoData.id);
    GlobalValues.setWorkProyecto(proyectoData);
    setIsOpen(false); // Cierra el menú desplegable al seleccionar un proyecto
    const fetchedLocations = await fetchLocationsFromFirestore(proyectoData.id);
    setLocations(fetchedLocations);
     };

  const onRegionChange = (region) => {
    //console.log(region);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text>☰ {GlobalValues.getWorkProyecto(false)}</Text>
        </TouchableOpacity>

        {/* Menú desplegable */}
        {isOpen && (
          <View style={styles.menu}>
            {projects.map((projects) => (
              <TouchableOpacity
                key={projects.id}
                onPress={() => onProyectoSelect(projects)}
              >
                <Text>{projects.name}</Text>
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
    top: 50,
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

