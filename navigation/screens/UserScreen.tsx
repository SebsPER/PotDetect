import * as React from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase Authentication
import { auth } from '../../firebaseConfig';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalValues from '../../utils/GlobalValues.tsx';

export default function UserScreen({ navigation }) {
  //const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase
  const [users, setUsers] = React.useState([]);
  const [modalAgre, setModalAgre] = React.useState(false);
  const [modalLog, setModalLog] = React.useState(false);
  const [logged, setLogged] = React.useState(false);
  const [logUser, setLogUser] = React.useState("");
  const [newNom, setNewNom] = React.useState("");
  const [newPwd, setNewPwd] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  const [newPerm, setNewPerm] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [valid, setValid] = React.useState(false);

  React.useEffect(() => {
    console.log("useefetc")
    const getList = async () => {
      const fetchedList = await fetchListFromFirestore();
      setUsers(fetchedList);
    };
    getList();

  }, [valid]);

  const fetchListFromFirestore = async () => {
    console.log("entro");
    ///para pruebas
    //const querySnapshot = await getDocs(collection(db, "Proyectos"));

    const usData = await getDocs(collection(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Usuarios'));

    const users = []
    usData.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.Nombre,
        priv: data.Permisos,
        contra: data.Contrasena
      });
    });
    return users
  };

  const handleDeleteProject = async (projectId) => {
    //const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este proyecto?');
    /*
        if (GlobalValues.getLogged()) {
          alert("Ingresa tus credenciales de usuario antes de eliminar un proyecto")
          return
        } else if (GlobalValues.getPermisos()) {
          alert("No tienes los permisos necesarios para eliminar un proyecto")
          return
        }*/

    if (/*confirmDelete*/true) {
      try {
        const proyectref = doc(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Usuarios', projectId);
        await deleteDoc(proyectref);


        const user = users.filter((project) => project.id !== projectId);
        setUsers(user);
        setValid(!valid);

      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      GlobalValues.setWorkProyectoName('')
      await signOut(auth); // Cierra la sesión del usuario actual
      navigation.navigate('Login'); // Redirecciona a la pantalla de inicio de sesión (Login)
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleItemClick = (item) => {
    setModalLog(true);
    setNom(item.name);
  };

  const getPrivilegeLabel = (privValue) => {
    if (privValue === 0) {
      return "Empleado";
    } else if (privValue === 1) {
      return "Admin";
    }
    // Puedes agregar más casos si es necesario
    return "Desconocido";
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.list}>
        <View style={styles.itemContainer}>
          <Text style={styles.nameText}>{item.name}</Text>

        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.projectCounter}>{getPrivilegeLabel(item.priv)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProject(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleCreateUser = () => {
    if (GlobalValues.getLogged()) {
      alert("Ingresa tus credenciales de usuario antes de agregar un empleado")
      return
    } else if (GlobalValues.getPermisos()) {
      alert("No tienes los permisos necesarios para agregar un empleado")
      return
    }
    setModalAgre(true);
  };

  const addWorker = async () => {
    console.log(GlobalValues.getEmpresaUID());
    const docRef = await addDoc(collection(db, "Empresas", GlobalValues.getEmpresaUID(), "Usuarios"), {
      Nombre: newNom,
      Contrasena: newPwd,
      Permisos: parseInt(newPerm)
    });
    const fetchedList = await fetchListFromFirestore();
    setValid(!valid);
    setUsers(fetchedList);
  };

  const checkCreds = async () => {
    const q = query(collection(db, "Empresas", GlobalValues.getEmpresaUID(), "Usuarios"), where('Nombre', '==', nom), where('Contrasena', '==', pwd));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Contraseña equivocada")
      setLogUser("");
      GlobalValues.setEmpleadoName("");
      GlobalValues.setEmpleadoId("");
      GlobalValues.setPermisos(0);
    } else {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        setLogged(true);
        setLogUser(doc.data().Nombre);
        GlobalValues.setEmpleadoName(doc.data());
        GlobalValues.setEmpleadoId(doc);
        GlobalValues.setPermisos(doc.data());
        GlobalValues.setLogged();
      });

    }
    console.log(GlobalValues.getPermisos());
    setNom("");
    setPwd("");
  };

  const handleAgregarEmpleado = () => {
    setModalVisible(true);
  };

  const handleGuardarEmpleado = () => {
    // Aquí puedes agregar la lógica para guardar el empleado en tu base de datos o realizar otras acciones necesarias.
    // Por ahora, simplemente cerramos el modal.
    setModalVisible(false);
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
            <Text style={styles.modalTitle}>Agregar Nuevo Empleado</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#B4B4B4"
              onChangeText={(text) => setNewNom(text)}
              value={newNom}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#B4B4B4"
              onChangeText={(text) => setNewPwd(text)}
              value={newPwd}
            />
            <TextInput
              style={styles.input}
              placeholder="Permisos (0 o 1)"
              placeholderTextColor="#B4B4B4"
              onChangeText={(text) => setNewPerm(text)}
              value={newPerm}
            />
            <Pressable style={styles.button}
              onPress={() => setModalAgre(!modalAgre)}
            >
              <Text style={styles.cancelButton}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.button}
              onPress={() => {
                addWorker()
                setModalAgre(!modalAgre)
              }}
            >
              <Text style={styles.addButton}>Agregar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalLog}
        onRequestClose={() => {
          alert("Cerro el modal");
        }}>

        <View style={styles.modalBackground}>
          <View style={styles.modalViewUser}>
            <Text style={styles.modalTitle}>Ingresa tus credenciales</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#B4B4B4"
              onChangeText={(text) => setPwd(text)}
              value={pwd}
            />
            <Pressable style={styles.button}
              onPress={() => setModalLog(!modalLog)}
            >
              <Text style={styles.cancelButton}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.button}
              onPress={() => {
                checkCreds()
                setModalLog(!modalLog)
              }}
            >
              <Text style={styles.addButton}>Iniciar Sesión</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Empleados</Text>
        <TouchableOpacity onPress={handleCreateUser} style={styles.createButton}>
          <Text style={styles.createButtonText}>Agregar Empleado +</Text>
        </TouchableOpacity>
      </View>
      {
        logUser === "" ?
          <Text>Elige tu perfil</Text>
          :
          <Text>¡Bienvenido! {logUser}</Text>
      }
      <FlatList
        style={{ marginTop: 15, marginHorizontal: 10 }}
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
      />
      <Button title="Cerrar Sesión" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectCounter: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContent: {
    flex: 1,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semiopaco
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Estilos para el contenedor del nombre y priv
    // ...otros estilos si los tienes
  },
  privContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Estilos para el contenedor de priv y el botón de eliminación
    // ...otros estilos si los tienes
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 30
  },
  modalView: {
    flex: 1,
    //justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    maxHeight: 300, // Ajusta este valor según tus necesidades
    //marginHorizontal:15,
    //marginVertical:70,
    margin: 30,
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
  modalViewUser: {
    flex: 1,
    //justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    maxHeight: 200, // Ajusta este valor según tus necesidades
    //marginHorizontal:15,
    //marginVertical:70,
    margin: 30,
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
  ModalAgreTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF6C5E'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  cancelButton: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 0,
    borderRadius: 5,
    color: '#B4B4B4'
  },
  addButton: {
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#67A25A'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10
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
  list: {
    flexDirection: 'row',
    backgroundColor: "#f5f5f5",
    borderBottomColor: "#f5f5f5",
    borderBottomWidth: 1,
    padding: 15,
    width: 350,
    justifyContent: 'space-between',
  },
});
