import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase Authentication
import { auth } from '../../firebaseConfig';

export default function UserScreen({ navigation }) {
  //const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Cierra la sesión del usuario actual
      navigation.navigate('Login'); // Redirecciona a la pantalla de inicio de sesión (Login)
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>UserScreen</Text>
      <Button title="Cerrar Sesión" onPress={handleSignOut} />
    </View>
  );
}
