import * as React from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { getAuth, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase Authentication
import { auth } from '../../firebaseConfig';
import {db} from '../../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
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

  React.useEffect(() => {
    const getList = async () => {
      const fetchedList = await fetchListFromFirestore();
      setUsers(fetchedList);
    };
    getList();
  }, []);

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
        name:data.Nombre,
        priv:data.Permisos,
        contra:data.Contrasena
      });
    });
    return users
  };

  const handleSignOut = async () => {
    try {
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

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.list}>
        <Text>{item.name}</Text>
        <Text>{item.priv}</Text>
      </View>
    </TouchableOpacity>
    );

  const handleCreateUser = () => {
    setModalAgre(true);
  };

  const addWorker = async () => {
    console.log(GlobalValues.getEmpresaUID());
    const docRef = await addDoc(collection(db, "Empresas", GlobalValues.getEmpresaUID(), "Usuarios"), {
      Nombre: newNom,
      Constrasena: newPwd,
      Permisos: parseInt(newPerm)
     });
    const fetchedList = await fetchListFromFirestore();
    setUsers(fetchedList);
  };

  const checkCreds = async () => {
    const q = query(collection(db, "Empresas", GlobalValues.getEmpresaUID(), "Usuarios"), where('Nombre', '==', nom), where('Contrasena', '==', pwd));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Contraseña equivocada")
    } else {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        setLogged(true);
        setLogUser(doc.data().Nombre);
        GlobalValues.setEmpleadoName(doc.data());
        GlobalValues.setEmpleadoId(doc);
        GlobalValues.setPermisos(doc.data());
      });
    }

    setNom("");
    setPwd("");
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
        <View style={styles.modalView}>
        <Text>Agregar Nuevo Empleado</Text>
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
      </Modal>
      <Modal
      animationType='slide'
      transparent={true}
      visible={modalLog}
      onRequestClose={() => {
        alert("Cerro el modal");
      }}>
        <View style={styles.modalView}>
        <Text>Ingresa tus credenciales</Text>
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
           style={{marginTop:15, marginHorizontal:10}}
           data={users}
           renderItem={renderUserItem}
           keyExtractor={(item) => item.id}
      />
      <Button title="Cerrar Sesión" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 30
  },
  modalView: {
    flex:1,
    marginHorizontal:15,
    marginVertical:"77%",
    margin:20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding:35,
    alignItems:'center',
    shadowColor:'#000',
    shadowOffset: {
      width:0,
      height:2
    },
    shadowOpacity:0.25,
    shadowRadius:4,
    elevation:5
  },
  ModalAgreTitle: {
    textAlign:'center',
    fontWeight: 'bold',
    color: '#FF6C5E'
  },
  button: {
    borderRadius:20,
    padding:10,
    elevation:2
  },
  cancelButton: {
    textAlign:'center',
    fontWeight: 'bold',
    color: '#B4B4B4'
  },
  addButton: {
    textAlign:'center',
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
