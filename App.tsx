import React, { useEffect, useState } from 'react';

import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth } from './firebaseConfig';

import MainContainer from './navigation/MainContainer';
import LoginScreen from './navigation/screens/login';
import Register from './navigation/screens/RegisterUser';

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprueba el estado de autenticación del usuario
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={MainContainer} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainContainer} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

/*

 return (
           <NavigationContainer>
             {user ? <MainContainer /> : <LoginScreen />}
           </NavigationContainer>
         );

*/

export default App;
