import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { deleteDoc, doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import {db} from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import GlobalValues from '../../utils/GlobalValues.tsx';

export default function RegisterScreen({navigation}) {
  const [ruc, setRuc] = useState('');
  const [passwordU, setpasswordU] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [genero, setGenero] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      //const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
try {
      const docRef = await addDoc(collection(db, "Empresas"), {
           RUC: ruc,
                      Correo: email,
                      Contrasena: password,
          });

      GlobalValues.setEmpresaUID(docRef.id);

          const Proyecto = await addDoc(collection(db, 'Empresas', docRef.id, 'Usuarios'),{
                                Nombre: nombre,
                           Contrasena: passwordU,
                           Permisos: 1,
                       });

      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Main');
} catch (e) {
   console.error("Error adding document: ", e);
  }

      // El usuario se ha registrado con éxito
      setError(null);
    } catch (error) {
      setError(error.message); // Captura y muestra el mensaje de error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="RUC de la empresa"
        onChangeText={(text) => setRuc(text)}
        value={ruc}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Nombre Usuario"
        onChangeText={(text) => setNombre(text)}
        value={nombre}
      />
      <TextInput
              style={styles.input}
              placeholder="Contraseña Usuario"
              onChangeText={(text) => setpasswordU(text)}
              secureTextEntry
              value={passwordU}
            />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

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
});

export default RegisterScreen;
