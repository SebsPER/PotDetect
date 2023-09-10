import * as React from 'react';

import MainContainer from './navigation/MainContainer';

function App() {
  return(
    <MainContainer/>
  )
}

export default App;

/*import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import FormData from 'form-data';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  
export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [capturedImageUri, setCapturedImageUri] = useState('');
  const [responseData, setResponseData] = useState('');
  const [baseImg, setbaseImg] = useState('');
  const [photoTaken, setPhotoTaken] = useState(true);
  const cameraRef = useRef(null);

  const [location, setLocation] = useState<Location.LocationObjectCoords>({"accuracy": 32.18999583376263, "altitude": 157.40081787109375, "altitudeAccuracy": 16.810970306396484, "heading": -1, "latitude": -12.104007595961612, "longitude": -76.99086161121983, "speed": -1});
  const [errorMsg, setErrorMsg] = useState(null);
  
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({accuracy: 4});
      setLocation(loc.coords);
      console.log(loc.coords);
      //console.log(location);
    })();
  }, []);


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

    const loc = await Location.getCurrentPositionAsync({accuracy: 4});
    setLocation(loc.coords);

    try {
        // Defining image URI
      const imageUri = photo.uri;

      //const apiUrl = 'http://localhost:5000/media/upload'
      const apiUrl = 'http://192.168.1.9:5000/media/upload'; // Replace with your API endpoint URL

      const name_ = photo.uri.split('/').pop();

      const type_ = name_ ? name_.split('.').pop() : '';

        // Read the file data using Expo FileSystem
      const fileData = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      let formData = new FormData();
      formData.append('file', {uri:photo.uri, name: name_, type:'image/'+type_});

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

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      {photoTaken ?(
        <View style={{flex: 1}}>
        <Camera style={StyleSheet.absoluteFill} type={type} ref={cameraRef}>
        </Camera>
        <TouchableOpacity style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          bottom: 50,
          alignSelf: 'center',
          opacity: 0.5,
          }} onPress={__takePicture}>
        </TouchableOpacity>
      </View>):(
        <View style={styles.container}>
          <View style={{flex:5, flexDirection:'column' ,justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${baseImg}`}}
              loadingIndicatorSource={require("./assets/loading_det.gif")}
            />
          </View>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:3, flexDirection:'column'}}>
          <TouchableOpacity style={{width:'100%', height:50,borderWidth:1, alignSelf:'flex-start', borderRadius:10, justifyContent:'center', alignItems:'center',}}
          onPress={() => {
            setPhotoTaken(true)
            setbaseImg('')
          }}>
            <Text>Return</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width:'100%', height:50,borderWidth:1, alignSelf:'flex-start', borderRadius:10, justifyContent:'center', alignItems:'center',}}>
            <Text>Save</Text>
          </TouchableOpacity>
          </View>
          <View style={{flex:3, flexDirection:'column'}}>
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
});
*/