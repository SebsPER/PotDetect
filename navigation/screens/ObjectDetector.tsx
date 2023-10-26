import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Modal, Pressable, FlatList } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import FormData from 'form-data';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { deleteDoc, doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, increment, getCountFromServer } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from '../../firebaseConfig';
import uuid from 'react-native-uuid';
import GlobalValues from '../../utils/GlobalValues.tsx';
import { useFocusEffect } from '@react-navigation/native';

import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ObjectDetector({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  const [projects, setProjects] = useState([]);
  const [capturedImageUri, setCapturedImageUri] = useState('');
  const [responseData, setResponseData] = useState('');
  const [baseImg, setbaseImg] = useState('');
  const [photoTaken, setPhotoTaken] = useState(true);
  const cameraRef = useRef(null);

  const [location, setLocation] = useState<Location.LocationObjectCoords>({ "accuracy": 32.18999583376263, "altitude": 157.40081787109375, "altitudeAccuracy": 16.810970306396484, "heading": -1, "latitude": -12.104007595961612, "longitude": -76.99086161121983, "speed": -1 });
  const [errorMsg, setErrorMsg] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  var proy = GlobalValues.getWorkProyecto();
  var noChange = GlobalValues.getRefresh();
  //dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [Title, setTitle] = useState("");
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useFocusEffect(
    useCallback(() => {

      const getProyectos = async () => {
        const proyectos = await fetchListFromFirestore();
        setProjects(proyectos)
      };

      getProyectos();
      (async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({ accuracy: 4 });
        setLocation(loc.coords);
      })();

    }, [noChange])
  );

  useFocusEffect(
    useCallback(() => {
      // Tu código aquí que se ejecutará cuando cambie 'proy'
      const proyectos = async () => {
        const val = GlobalValues.getWorkProyecto(false)
        setTitle(val)
      };

      proyectos();
    }, [proy])
  );


  const fetchListFromFirestore = async () => {

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


  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const __takePicture = async () => {
    if (!cameraRef) return
    if (GlobalValues.getLogged()) {
      alert("Ingresa tus credenciales de usuario antes de hacer una detección")
      return
    }
    const photo = await cameraRef.current.takePictureAsync()
    //console.log(photo)
    setPhotoTaken(false)
    setCapturedImageUri(photo.uri)

    const loc = await Location.getCurrentPositionAsync({ accuracy: 4 });
    setLocation(loc.coords);

    try {
      // Defining image URI
      const imageUri = photo.uri;

      //const apiUrl = 'http://localhost:5000/media/upload'
      const apiUrl = 'http://172.16.221.151:5000/media/upload';

      const name_ = photo.uri.split('/').pop();

      const type_ = name_ ? name_.split('.').pop() : '';

      // Read the file data using Expo FileSystem
      const fileData = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      let formData = new FormData();
      formData.append('file', { uri: photo.uri, name: name_, type: 'image/' + type_ });

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // // Handle the API response here
      console.log('Response:', response.data.elapsed);
      setResponseData(response.data);
      setbaseImg(response.data.base_64)
    } catch (error) {
      // Handle any errors here
      console.error('Error:', error);
    }
  };

  const save_detection = async () => {
    if (responseData.Hueco != 0 || responseData.HuecoGrave != 0 || responseData.Grieta != 0) {

      console.log(GlobalValues.getEmpresaUID())
      console.log(GlobalValues.getProyectoUID())

      try {
        const uri = FileSystem.cacheDirectory + 'signature-image-temp.png'
        await FileSystem.writeAsStringAsync(
          uri,
          baseImg,
          {
            'encoding': FileSystem.EncodingType.Base64
          }
        )
        console.log(uri);
        const img = await fetch(uri);
        //console.log('a');
        const bytes_blb = await img.blob();
        //console.log('b');
        const fileName = uuid.v4();
        //console.log('c');
        const storageRef = ref(storage, `${fileName}.jpg`);
        //console.log('d');
        //await uploadBytes(storageRef, bytes_blb);
        const uploadTask = await uploadBytesResumable(storageRef, bytes_blb);
        //console.log('e');

        const url = await getDownloadURL(storageRef);
        //console.log('f');

        const empleado = GlobalValues.getEmpleadoName();
        //console.log(empleado);

        const docRef = await addDoc(collection(db, "Empresas", GlobalValues.getEmpresaUID(), 'Proyecto', GlobalValues.getProyectoUID(), 'Registro'), {
          latitude: location.latitude,
          longitude: location.longitude,
          title: 'deteccion',
          description: 'primer intento',
          Huecos: responseData.Hueco,
          HuecosGraves: responseData.HuecoGrave,
          Grietas: responseData.Grieta,
          Url: url,
          Path: fileName,
          Usuario: empleado
        });
        console.log("Document written with ID: ", docRef.id);
        const proyRef = doc(db, "Empresas", GlobalValues.getEmpresaUID(), 'Proyecto', GlobalValues.getProyectoUID());

        await updateDoc(proyRef, {
          Contador: increment(1)
        });
        alert("Guardado de imagen exitoso!");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("los valores es 0 x eso no se efectua el guardado");
      alert("No se detectaron daños");
    }
  }

  const modalOnClose = () => {
    setIsModalVisible(false);
  };

  const handleItemClick = (item) => {
    console.log(item.id)
    GlobalValues.setProyectoUID(item.id)
    GlobalValues.setWorkProyecto(item);
    save_detection();
    setIsModalVisible(false);
    setPhotoTaken(true);
  };

  const renderProyList = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.list}>
        <Text style={{ color: '#101651' }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Elegir Proyecto</Text>
            <Pressable onPress={modalOnClose}>
              <Ionicons name={"close"} size={22} color={"#101651"} />
            </Pressable>
          </View>
          <FlatList
            style={{ marginTop: 10, marginHorizontal: 10 }}
            data={projects}
            renderItem={renderProyList}
            keyExtractor={(item) => item.id}
          />
        </View>
      </Modal>


      {photoTaken ? (
        <View style={{ flex: 1 }}>
          <Camera style={StyleSheet.absoluteFill} type={type} ref={cameraRef}>
          </Camera>
          <TouchableOpacity style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            opacity: 0.5,
          }} onPress={__takePicture}>
          </TouchableOpacity>
        </View>) : (
        <View style={styles.container}>
          <View style={{ flex: 4.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Image
              style={styles.image}
              source={{ uri: `data:image/png;base64,${baseImg}` }}
              placeholder={blurhash}
            //placeholder={{uri: 'https://www.icegif.com/wp-content/uploads/2023/05/icegif-186.gif'}}
            //loadingIndicatorSource={require("./assets/loading_det.gif")}
            />
          </View>
          <View style={{ flex: 1.5, flexDirection: 'column', justifyContent: "space-around" }}>
            <View style={{ flex: 4, flexDirection: 'column', justifyContent: "space-around" }}>
              <Text style={styles.damageTextTitle}>Reporte de detección</Text>
              <Text style={styles.damageText}>Huecos: {responseData.Hueco}</Text>
              <Text style={styles.damageText}>Huecos Graves: {responseData.HuecoGrave}</Text>
              <Text style={styles.damageText}>Grietas: {responseData.Grieta}</Text>
              <Text style={styles.damageText}>Tiempo de Inferencia: {responseData.elapsed}</Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'row', justifyContent: "space-evenly" }}>
              <TouchableOpacity style={{ width: '47%', height: 50, borderWidth: 1, alignSelf: 'flex-start', borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: "white", borderColor: "#28D585" }}
                onPress={() => {
                  setPhotoTaken(true)
                  setbaseImg('')
                }}>
                <Text style={{ color: "#28D585" }}>Return</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '47%', height: 50, borderWidth: 1, alignSelf: 'flex-start', borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: "#28D585", borderColor: "#28D585" }}
                onPress={() => {
                  setIsModalVisible(true)
                }}>
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      )}



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  damageText: {
    fontSize: 14,
    color: '#8F8F8F',
    marginLeft: 15,
    fontFamily: "Arial"
  },
  damageTextTitle: {
    fontSize: 18,
    color: '#2A3C44',
    marginLeft: 15,
    fontFamily: "Arial",
    fontWeight: "bold"
  },
  modalContent: {
    height: '35%',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#F5F5F5',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#101651',
    fontFamily: "Arial",
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