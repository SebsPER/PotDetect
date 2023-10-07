import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import GlobalValues from '../../utils/GlobalValues.tsx';
import { useFocusEffect } from '@react-navigation/native';

export default function MapScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [selectedProyectoName, setSelectedProyectoName] = useState("Selecciona un Proyecto");

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalAgre, setModalAgre] = React.useState(false);

  const [grieta, setGrietas] = useState(0);
  const [hueco, setHueco] = useState(0);
  const [huecoGrave, setHuecoGrave] = useState(0);
  const [description, setDescription] = useState("");
  const [foto, setFoto] = useState("");
  const [Usuario, setUserName] = useState("");

  var proy = GlobalValues.getWorkProyecto();
  var noChange = GlobalValues.getRefresh();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useFocusEffect(
    useCallback(() => {
      // Tu código aquí que se ejecutará cuando cambie 'proy'
      const proyectos = async () => {
        const proyectosData = await fetchListFromFirestore();
        setProjects(proyectosData);
      };

      proyectos();
    }, [noChange])
  );
  useFocusEffect(
    useCallback(() => {
      // Tu código aquí que se ejecutará cuando cambie 'noChange'
      const fetchLocations = async () => {
        const fetchedLocations = await fetchLocationsFromFirestore(GlobalValues.getWorkProyecto(true));
        setLocations(fetchedLocations);
      };

      fetchLocations();
    }, [proy])
  );

  const fetchListFromFirestore = async () => {
    //console.log("entro");
    ///para pruebas
    //const querySnapshot = await getDocs(collection(db, "Proyectos"));

    const Proyecto = await getDocs(collection(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto'));

    const projects = []
    Proyecto.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        name: data.Nombre,
      });
    });
    return projects
  };

  const fetchLocationsFromFirestore = async (proyectoUid) => {

    const querySnapshot = await getDocs(collection(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto', proyectoUid, 'Registro'));
    const locations = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // console.log(doc.title);
      // console.log(data.latitude);
      // console.log(data.longitude);
      // console.log(data.description);
      locations.push({
        title: data.title,
        Grieta: data.Grietas,
        Hueco: data.Huecos,
        HuecoGrave: data.HuecosGraves,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        description: data.description,
        foto: data.Url,
        Usuario: data.Usuario
      });
    });
    return locations;
  };

  const onProyectoSelect = async (proyectoData) => {
    GlobalValues.setProyectoUID(proyectoData.id);
    setSelectedProyecto(proyectoData.id);
    GlobalValues.setProyectoUID(proyectoData.id);
    GlobalValues.setWorkProyecto(proyectoData);
    setIsOpen(false); // Cierra el menú desplegable al seleccionar un proyecto
    const fetchedLocations = await fetchLocationsFromFirestore(GlobalValues.getWorkProyecto(true));
    setLocations(fetchedLocations);
  };

  const onRegionChange = (region) => {
    //console.log(region);
  };

  const handleCreateUser = (Grietaa, Huecoo, HuecoGravee, descriptionn, fotoo, Usuario) => {
    setGrietas(Grietaa)
    setHueco(Huecoo)
    setHuecoGrave(HuecoGravee)
    setDescription(descriptionn)
    setFoto(fotoo)
    setUserName(Usuario)

    setModalAgre(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalAgre}
        onRequestClose={() => {
          alert("Cerro el modal");
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Datos del daño</Text>
            <Text style={styles.dato}>Usuario: {grieta}</Text>
            <Text style={styles.dato}>grieta: {grieta}</Text>
            <Text style={styles.dato}>hueco: {hueco}</Text>
            <Text style={styles.dato}>huecoGrave: {huecoGrave}</Text>
            <Image
              source={{ uri: foto }}
              style={styles.modalImage}
            />
            <Pressable style={styles.button}
              onPress={() => setModalAgre(!modalAgre)}
            >
              <Text style={styles.cancelButton}>Cancelar</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
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
            onPress={() => handleCreateUser(location.Grieta, location.Hueco, location.HuecoGrave, location.description, location.foto, location.Usuario)}
          >
          </Marker>
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
  modalImage: {
    width: 600, // Ancho deseado de la imagen
    height: 600, // Altura deseada de la imagen
    resizeMode: 'contain', // Puedes ajustar el modo de redimensionamiento según tus necesidades
    borderRadius: 10, // Bordes redondeados u otros estilos según prefieras
  },
  modalContent: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    //maxHeight: 330, // Ajusta este valor según tus necesidades
    //marginHorizontal:15,
    //marginVertical:70,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  addButton: {
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#67A25A'
  },

  cancelButton: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 0,
    borderRadius: 5,
    color: '#B4B4B4'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },

  ModalAgreTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF6C5E'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semiopaco
    //justifyContent: 'center',
    //alignItems: 'center',
  },

  map: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    backgroundColor: '#FF6C5E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
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

