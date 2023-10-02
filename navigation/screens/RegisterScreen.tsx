import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import GlobalValues from '../../utils/GlobalValues.tsx';
import { useFocusEffect } from '@react-navigation/native';

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

  const fetchListFromFirestore = async () => {
  

    const querySnapshot = await getDocs(collection(db, "Empresas", GlobalValues.getEmpresaUID(), 'proyectos', GlobalValues.getProyectoUID(), 'Registro'));
    const detections = []

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("id",data.id)
      detections.push({
        id: doc.id,
        name: data.title,
        HuecoGrave: data.HuecosGraves,
        Hueco: data.Huecos,
        Grieta: data.Grietas,
        photo: data.foto
      });
    });
    console.log("detection",detections)
    return detections
  };

  const handleItemClick = (item) => {
    // console.log(`Hiciste clic en ${item.nombre}`);
  };

  const handleCreateProject = () => {
    navigation.navigate('Registros')
  };

  const renderDetectionItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.detectionItem}>
        <Image source={{ uri: item.foto }} style={styles.detectionImage} />
        <View style={styles.detectionInfo}>
          <View style={styles.column}>
            <Text>Hueco Grave: {item.HuecoGrave}</Text>
            <Text>Hueco: {item.Hueco}</Text>
            <Text>Grieta: {item.Grieta}</Text>
          </View>
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