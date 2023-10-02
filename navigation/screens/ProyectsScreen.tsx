import { useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalValues from '../../utils/GlobalValues.tsx';
import { useFocusEffect } from '@react-navigation/native';

export default function ProyectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [selProy, setSelProy] = useState("");


  useFocusEffect(
    React.useCallback(() => {
      const getList = async () => {
        const fetchedList = await fetchListFromFirestore();
        setProjects(fetchedList);
      };
      getList();
      return () => {
        setProjects([])
      }
    }, [])
  );
  // useEffect(() => {
  //   const getList = async () => {
  //     const fetchedList = await fetchListFromFirestore();
  //     setProjects(fetchedList);
  //   };
  //   getList();
  // }, []);

  const fetchListFromFirestore = async () => {
    console.log("entro");
    console.log("asd",GlobalValues.getEmpresaUID())
    ///para pruebas
    //const querySnapshot = await getDocs(collection(db, "Proyectos"));

    const Proyecto = await getDocs(collection(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto'));

    const projects = []
    Proyecto.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        name: data.Nombre,
        description: data.Descripcion,
        counter: data.Contador,
        photo: data.Froto
      });
    });
    return projects
  };

  const handleItemClick = (item) => {
    GlobalValues.setListProy(item.id);
    console.log(`Hiciste clic en ${item.id}`);
    navigation.navigate('Registros');
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.projectItem}>
        <Image source={{ uri: item.photo }} style={styles.projectImage} />
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.projectDescription}>{item.description}</Text>
        </View>
        <Text style={styles.projectCounter}>{item.counter}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleCreateProject = () => {
    navigation.navigate('RegistrosP')
    //Aqui se navega a una pestaña para crear un proyecto nuevo
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proyectos</Text>
        <TouchableOpacity onPress={handleCreateProject} style={styles.createButton}>
          <Text style={styles.createButtonText}>Crear Nuevo Proyecto</Text>
        </TouchableOpacity>
      </View>
      <Text>Proyecto seleccionado: {GlobalValues.getWorkProyecto(false)}</Text>
      <FlatList
        style={{ marginTop: 15 }}
        data={projects}
        renderItem={renderProjectItem}
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
    paddingTop: 30,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#FF6C5E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  projectImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  projectInfo: {
    flex: 1,
    marginLeft: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
  },
  projectCounter: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
