import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import FormData from 'form-data';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { deleteDoc, doc, getDoc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../firebaseConfig';
import uuid from 'react-native-uuid';
import GlobalValues from '../../utils/GlobalValues.tsx';
import { useFocusEffect } from '@react-navigation/native';

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
    console.log("entro");

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
      const apiUrl = 'http://10.11.156.10:5000/media/upload'; // Replace with your API endpoint URL

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
          // Add any other headers you need, such as authorization headers
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
        const bytes_blb = await img.blob();
        const fileName = uuid.v4()
        const storageRef = ref(storage, `${fileName}.jpg`);

        await uploadBytes(storageRef, bytes_blb);


        const url = await getDownloadURL(storageRef);


        const docRef = await addDoc(collection(db, "Empresas", GlobalValues.getEmpresaUID(), 'Proyecto', GlobalValues.getProyectoUID(), 'Registro'), {
          latitude: location.latitude,
          longitude: location.longitude,
          title: 'deteccion',
          description: 'primer intento',
          Huecos: responseData.Hueco,
          HuecosGraves: responseData.HuecoGrave,
          Grietas: responseData.Grieta,
          Url: url
        });
        console.log("Document written with ID: ", docRef.id);

      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("los valores es 0 x eso no se efectua el guardado");
      alert("No se detectaron daños");
    }
  }

  const onProyectoSelect = async (proyectoData) => {
    console.log(proyectoData.id)
    GlobalValues.setProyectoUID(proyectoData.id)
    GlobalValues.setWorkProyecto(proyectoData);
    // const a = GlobalValues.getProyectoUID()
    // console.log("a", a)
    setSelectedProyecto(proyectoData.id);
    setIsOpen(false);
    // Cierra el menú desplegable al seleccionar un proyecto
    //const fetchedLocations = await fetchLocationsFromFirestore(proyectoUid);
    //setLocations(fetchedLocations);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text>☰ {Title}</Text>
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
          <View style={{ flex: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Image
              style={styles.image}
              source={{ uri: `data:image/png;base64,${baseImg}` }}
              placeholder={blurhash}
            //placeholder={{uri: 'https://www.icegif.com/wp-content/uploads/2023/05/icegif-186.gif'}}
            //loadingIndicatorSource={require("./assets/loading_det.gif")}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 3, flexDirection: 'column' }}>
              <TouchableOpacity style={{ width: '100%', height: 50, borderWidth: 1, alignSelf: 'flex-start', borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => {
                  setPhotoTaken(true)
                  setbaseImg('')
                }}>
                <Text>Return</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '100%', height: 50, borderWidth: 1, alignSelf: 'flex-start', borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => {
                  save_detection()
                  setPhotoTaken(true)
                }}>
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3, flexDirection: 'column' }}>
              <Text>Huecos: {responseData.Hueco}</Text>
              <Text>Huecos Graves: {responseData.HuecoGrave}</Text>
              <Text>Grietas: {responseData.Grieta}</Text>
              <Text>Tiempo de Inferencia: {responseData.elapsed}</Text>
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
});