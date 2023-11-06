import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Pressable, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import GlobalValues from '../../utils/GlobalValues.tsx';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

  const [isModalVisible, setIsModalVisible] = useState(false);

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
      if (GlobalValues.getWorkProyecto(true) != null) {
        fetchLocations();
      }
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
    setGrietas(Grietaa);
    setHueco(Huecoo);
    setHuecoGrave(HuecoGravee);
    setDescription(descriptionn);
    setFoto(fotoo);
    setUserName(Usuario);
    setModalAgre(true);
  };

  const modalOnClose = () => {
    setIsModalVisible(false);
  };

  const handleItemClick = (item) => {
    console.log(item.id)
    GlobalValues.setProyectoUID(item.id);
    GlobalValues.setWorkProyecto(item);
    onProyectoSelect(item);
  };

  const renderProyList = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.list}>
        <Text style={{color: '#28D585' }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      
      {!modalAgre ? (
      <View style={styles.container}>
        <Modal animationType="fade" transparent={true} visible={isModalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={{flexDirection:'column', justifyContent:'space-evenly'}}>
              <Text style={{fontSize: 24, fontWeight:'bold', marginHorizontal:"5%", marginTop:"5%", color:"#363434"}}>Filtrar</Text>
              <Text style={{fontSize: 16, marginHorizontal:"5%", color: "#858585"}}>Selecccionar un proyecto para ver los registros relacionados</Text>
              <FlatList
                style={{ marginTop: "1%", marginHorizontal: "5%", height: "40%"}}
                data={projects}
                renderItem={renderProyList}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity style={{ marginHorizontal:"5%", height: "20%", borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: "#28D585", borderColor: "#28D585" }}
                onPress={modalOnClose}>
                <Text style={{ color: "white", fontWeight: 'bold' }}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>

        </Modal>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() =>{setIsModalVisible(true)}} style={styles.filterButton}>
            {
              GlobalValues.getProyectoUID() === null ?
                <Text style={{fontSize:14, color:"white"}}>Filtrar <Ionicons name="md-filter" size={18} color="white" /></Text>
                :
                <Text style={{fontSize:14, color:"white"}}>{GlobalValues.getWorkProyecto(false)} <Ionicons name="md-filter" size={18} color="white" /></Text>
            }
          </TouchableOpacity>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onRegionChange={onRegionChange}
          initialRegion={{
            latitude: -11.969071010202395,
            latitudeDelta: 1.5772551319534536,
            longitude: -76.90717739984393,
            longitudeDelta: 0.9701124206185341,
          }}
          customMapStyle={true ? mapStyle : null}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              coordinate={location.location}
              onPress={() => handleCreateUser(location.Grieta, location.Hueco, location.HuecoGrave, location.description, location.foto, location.Usuario)}
              image={require('../../assets/fluent_location-16-filled.png')}
            >
            </Marker>
          ))}
        </MapView>
        </View>) : (
        <View style={styles.container}>
        <View style={{ height:"70%", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <Image
            style={styles.image}
            source={{ uri: foto }}
          //placeholder={{uri: 'https://www.icegif.com/wp-content/uploads/2023/05/icegif-186.gif'}}
          //loadingIndicatorSource={require("./assets/loading_det.gif")}
          />
        </View>
        <View style={{ height:"30%", flexDirection: 'column', justifyContent: "space-evenly" }}>
          <View style={{ height:"65%", flexDirection: 'column', justifyContent: "space-around" }}>
            <Text style={styles.damageTextTitle}><Image source={require('../../assets/tdesign_location-1.png')} style={{height:14, width:14}}/> Reporte de detección</Text>
            <Text style={styles.damageText}><Text style={{fontSize: 14, color: '#8F8F8F', marginLeft: 15, fontWeight:'bold'}}>Huecos:</Text> {hueco} </Text> 
            <Text style={styles.damageText}><Text style={{fontSize: 14, color: '#8F8F8F', marginLeft: 15, fontWeight:'bold'}}>Huecos Graves:</Text> {huecoGrave}</Text>
            <Text style={styles.damageText}><Text style={{fontSize: 14, color: '#8F8F8F', marginLeft: 15, fontWeight:'bold'}}>Grietas:</Text> {grieta}</Text>
            <Text style={styles.damageText}><Text style={{fontSize: 14, color: '#8F8F8F', marginLeft: 15, fontWeight:'bold'}}>Empleado:</Text> {Usuario}</Text>
          </View>
          <View style={{ height: "35%", flexDirection: 'row', justifyContent: "space-evenly", alignItems:"center" }}>
            <TouchableOpacity style={{ width: '95%', height: "60%", borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: "#28D585", borderColor: "#28D585" }}
              onPress={() => {
                setModalAgre(false);
              }}>
              <Text style={{ color: "white", fontWeight: 'bold' }}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>)}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },
  modalImage: {
    width: 600, // Ancho deseado de la imagen
    height: 600, // Altura deseada de la imagen
    resizeMode: 'contain', // Puedes ajustar el modo de redimensionamiento según tus necesidades
    borderRadius: 10, // Bordes redondeados u otros estilos según prefieras
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
  damageText: {
    fontSize: 14,
    color: '#8F8F8F',
    marginLeft: 15
  },
  damageTextTitle: {
    fontSize: 18,
    color: '#2A3C44',
    marginLeft: 15,
    fontWeight: "bold"
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
    top: 80,
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
  filterContainer: {
    position: 'absolute',
    backgroundColor: '#28D585',
    top: "8%",
    //width: "22%",
    alignSelf: 'center',
    paddingHorizontal: 12,
    height: "5%",
    borderRadius: 100,
    elevation: 2,
    zIndex: 1,
  },
  filterButton: {
    flex: 1,
    flexDirection:"row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  modalContent: {
    height: '35%',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    bottom: 0,
    position: 'absolute'
  },
  titleContainer: {
    height: '12%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    color: '#101651',
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  list: {
    flexDirection: 'row',
    padding: 15,
    width: "100%",
    justifyContent: 'center',
  },
});

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#F5F5F1",
      },
    ],
  },
  {
    elementType: "geometry.fill",
    stylers: [
      {
        saturation: -5,
      },
      {
        lightness: -5,
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  // {
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#757575",
  //     },
  //   ],
  // },
  // {
  //   elementType: "labels.text.stroke",
  //   stylers: [
  //     {
  //       color: "#212121",
  //     },
  //   ],
  // },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  // {
  //   featureType: "administrative.country",
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#9E9E9E",
  //     },
  //   ],
  // },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  // {
  //   featureType: "administrative.locality",
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#BDBDBD",
  //     },
  //   ],
  // },
  // {
  //   featureType: "poi",
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#757575",
  //     },
  //   ],
  // },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#CFEFD6",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  // {
  //   featureType: "poi.park",
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#616161",
  //     },
  //   ],
  // },
  // {
  //   featureType: "poi.park",
  //   elementType: "labels.text.stroke",
  //   stylers: [
  //     {
  //       color: "#1B1B1B",
  //     },
  //   ],
  // },
  {
    featureType: "road",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#FFFFFF",
      },
    ],
  },
  // {
  //   featureType: "road",
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#8A8A8A",
  //     },
  //   ],
  // },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#FFFFFF",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#FFFFFF",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#FFFFFF",
      },
    ],
  },
  // {
  //   featureType: "road.local",
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#616161",
  //     },
  //   ],
  // },
  // {
  //   featureType: "transit",
  //   elementType: "labels.text.fill",
  //   stylers: [
  //     {
  //       color: "#757575",
  //     },
  //   ],
  // },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#B1E1F7",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3D3D3D",
      },
    ],
  },
];