import * as React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Screens
import ObjectDetector from './screens/ObjectDetector';
import MapScreen from './screens/MapScreen';
import UserScreen from './screens/UserScreen';
import ProyectsScreen from './screens/ProyectsScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterProyect from './screens/RegisterProyect';

// Names
const objectScreenName = 'Camara';
const mapScreenName = 'Mapa';
const userScreenName = 'Empleados';
const proyectScreenName = 'Proyectos';
const registerScreen = 'Registros';
const registerProyect = 'RegistrosP';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <Tab.Navigator
            initialRouteName={objectScreenName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === objectScreenName) {
                        iconName = focused ? 'camera' : 'camera-outline';
                    } else if (rn === mapScreenName) {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (rn === userScreenName) {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (rn === proyectScreenName) {
                        iconName = focused ? 'folder' : 'folder';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: 'rgb(40, 213, 133)',
                tabBarInactiveTintColor: 'rgb(155, 174, 184)',
            })}>

            <Tab.Screen name={objectScreenName} component={ObjectDetector} options={{ headerShown: false, unmountOnBlur:true }} />
            <Tab.Screen name={mapScreenName} component={MapScreen} options={{ headerShown: false }} />
            <Tab.Screen name={proyectScreenName} component={ProyectsScreen} options={{ headerShown: false }} />
            <Tab.Screen name={userScreenName} component={UserScreen} options={{ headerShown: false }} />
            <Tab.Screen name={registerScreen} component={RegisterScreen} options={{ tabBarButton: () => null }} />
            <Tab.Screen name={registerProyect} component={RegisterProyect} options={{ tabBarButton: () => null, headerShown: false }} />
        </Tab.Navigator>

    )
};