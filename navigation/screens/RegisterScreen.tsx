import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, deleteDoc, increment, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { db, storage } from '../../firebaseConfig';
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import GlobalValues from '../../utils/GlobalValues.tsx';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import uuid from 'react-native-uuid';

export default function RegisterScreen({ navigation }) {
  const [detections, setDetections] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const getList = async () => {
        const fetchedList = await fetchListFromFirestore();
        setDetections(fetchedList);
      };
      getList();
      return () => {
        setDetections([])
      }
    }, [])
  );

  const handleDeleteRegister = async (registerId, imagePath) => {
    //const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este proyecto?');

    if (/*confirmDelete*/true) {
      try {

        const storageRef = ref(storage, imagePath + '.jpg');
        await deleteObject(storageRef);

        const registroref = doc(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto', GlobalValues.getProyectoUIDD(), 'Registro', registerId);
        await deleteDoc(registroref);

        const updatedRegister = detections.filter((project) => project.id !== registerId);
        setDetections(updatedRegister);

        const proyRef = doc(db, "Empresas", GlobalValues.getEmpresaUID(), 'Proyecto', GlobalValues.getProyectoUIDD());

        await updateDoc(proyRef, {
          Contador: increment(-1)
        });
        console.log("Delete completo");
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
      }
    }
  };

  const fetchListFromFirestore = async () => {

    const querySnapshot = await getDocs(collection(db, "Empresas", GlobalValues.getEmpresaUID(), 'Proyecto', GlobalValues.getProyectoUIDD(), 'Registro'));
    const detections = []

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("id", data.id)
      detections.push({
        id: doc.id,
        name: data.title,
        HuecoGrave: data.HuecosGraves,
        Hueco: data.Huecos,
        Grieta: data.Grietas,
        photo: data.Url,
        Path: data.Path,
        Empleado: data.Usuario
      });
    });
    console.log("detection", detections)
    return detections
  };

  const handleItemClick = (item) => {
    console.log(`Intentando descargar imagen`);
    downloadFromUrl(item.photo)
  };

  const handleCreateProject = () => {
    navigation.navigate('Registros')
  };

  const downloadFromUrl = async (url) => {
    const filename = `${GlobalValues.getWorkProyecto(false)}_${uuid.v4()}.jpg`;
    const result = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + filename
    );
    console.log(result);

    save(result.uri);
  };

  const save = (uri) => {
    Sharing.shareAsync(uri);
  }

  const renderDetectionItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.detectionItem}>
        <Image source={{ uri: item.photo }} style={styles.detectionImage} />
        <View style={styles.detectionInfo}>
          <View style={styles.column}>
            <Text>Hueco Grave: {item.HuecoGrave}</Text>
            <Text>Hueco: {item.Hueco}</Text>
            <Text>Grieta: {item.Grieta}</Text>
            <Text>Empleado: {item.Empleado}</Text>
          </View>
          <Text style={styles.projectCounter}></Text>
          <TouchableOpacity onPress={() => handleDeleteRegister(item.id, item.Path)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={detections}
        renderItem={renderDetectionItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  projectCounter: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  detectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  detectionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  detectionInfo: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 12,
  },
});