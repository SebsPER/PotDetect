import React, { useEffect, useState } from 'react';

import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth } from './firebaseConfig';

import MainContainer from './navigation/MainContainer';
import LoginScreen  from './navigation/screens/login';


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
            return <LoginScreen />;
          }

  return (
        <MainContainer />
    );
  }

export default App;
