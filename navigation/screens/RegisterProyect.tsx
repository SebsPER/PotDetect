import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { deleteDoc, doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import GlobalValues from '../../utils/GlobalValues.tsx';

export default function RegisterProyect({ navigation }) {

  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {

    try {
      console.log(nombre)
      console.log(foto)
      console.log(descripcion)
      console.log(GlobalValues.getEmpresaUID())

      const Proyecto = await addDoc(collection(db, 'Empresas', GlobalValues.getEmpresaUID(), 'Proyecto'), {
        Nombre: nombre,
        Descripcion: foto,
        Foto: descripcion,
        Contador: 0,
      });

    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={(text) => setNombre(text)}
        value={nombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Foto"
        onChangeText={(text) => setFoto(text)}
        value={foto}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripcion"
        onChangeText={(text) => setDescripcion(text)}
        value={descripcion}
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

export default RegisterProyect;
