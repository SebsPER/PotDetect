import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import RegisterScreen from './RegisterScreen'; // Importa la pantalla de registro
import { useNavigation } from '@react-navigation/native';
import GlobalValues from '../../utils/GlobalValues.tsx';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false); // Estado para mostrar/ocultar la pantalla de registro

  const handleSignIn = async () => {

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      //tengo que buscar en empresa el email y cuando lo encuentre extraigo el UID
      const Empresas = await getDocs(collection(db, 'Empresas'));

      const projects = []
      Empresas.forEach((doc) => {
        const data = doc.data();

        if (email == data.Correo) {
          GlobalValues.setEmpresaUID(doc.id);
        }
      });
      navigation.navigate('Main');
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  // Función para cambiar el estado y mostrar la pantalla de registro
  const showRegisterScreen = () => {

    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Botón para mostrar la pantalla de registro */}
      <TouchableOpacity onPress={showRegisterScreen}>
        <Text style={styles.registerText}>Registrarse</Text>
      </TouchableOpacity>

    </View>
  );
}

// Estilos (los estilos de RegisterScreen se deben definir en su propio archivo)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  registerText: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
