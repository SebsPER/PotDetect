import { useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
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

  const handleDeleteProject = async (projectId) => {
    //const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este proyecto?');
    if (GlobalValues.getLogged()) {
      alert("Ingresa tus credenciales de usuario antes de eliminar un proyecto")
      return
    } else if (GlobalValues.getPermisos()) {
      alert("No tienes los permisos necesarios para eliminar un proyecto")
      return
    }

    if (/*confirmDelete*/true) {
      try {
        const proyectref = doc(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto', projectId);
        const registrosCollectionRef = collection(proyectref, 'Registro');
        const registrosSnapshot = await getDocs(registrosCollectionRef);
        // Itera sobre los documentos de la colección interna y elimínalos
        registrosSnapshot.forEach(async (proyectoDoc) => {
          await deleteDoc(proyectoDoc.ref);
        });
        await deleteDoc(proyectref);
        await deleteDoc(proyectref)
        const updatedProjects = projects.filter((project) => project.id !== projectId);
        setProjects(updatedProjects);
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
      }
    }
  };

  const fetchListFromFirestore = async () => {
    console.log("entro");
    console.log("asd", GlobalValues.getEmpresaUID())
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
    GlobalValues.setProyectoUIDD(item.id);
    console.log(`Hiciste clic en ${item.id}`);
    navigation.navigate('Registros');
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.projectItem}>
        <Image source={require('../../assets/mdi_file-eye.png')} style={styles.projectImage} />
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.projectCounter}>{item.counter} Registros</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteProject(item.id)}>
          <Ionicons name="trash-outline" size={24} color="rgb(237, 127, 120)" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleCreateProject = () => {
    console.log(GlobalValues.getPermisos())
    /* if (GlobalValues.getLogged()) {
       alert("Ingresa tus credenciales de usuario antes de crear un proyecto")
       return
     } else if (GlobalValues.getPermisos()) {
       alert("No tienes los permisos necesarios para crear un proyecto")
       return
     }*/
    navigation.navigate('RegistrosP')
    //Aqui se navega a una pestaña para crear un proyecto nuevo
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proyectos</Text>

      </View>
      <FlatList
        style={{ marginTop: 15 }}
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={handleCreateProject} style={styles.createButton}>
        <Text style={styles.createButtonText}>Crear Nuevo Proyecto</Text>
      </TouchableOpacity>
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
    marginTop: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: 'rgb(40, 213, 133)',
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 10,
  },
  createButtonDisabled: {
    backgroundColor: '#FF6C5E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',

    textAlign: 'center'
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
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
  },
});
