import * as React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Screens
import ObjectDetector from './screens/ObjectDetector';
import MapScreen from './screens/MapScreen';
import UserScreen from './screens/UserScreen';

// Names
const objectScreenName = 'Camara';
const mapScreenName = 'Mapa';
const userScreenName = 'Ajustes';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return(
        <NavigationContainer>
            <Tab.Navigator
            initialRouteName={objectScreenName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === objectScreenName) {
                        iconName = focused ? 'camera':'camera-outline';
                    } else if (rn === mapScreenName) {
                        iconName = focused ? 'map':'map-outline';
                    } else if (rn === userScreenName) {
                        iconName = focused ? 'settings':'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'grey',
            })}>

            <Tab.Screen name={objectScreenName} component={ObjectDetector} options={{ headerShown: false }}/>
            <Tab.Screen name={mapScreenName} component={MapScreen} options={{ headerShown: false }}/>
            <Tab.Screen name={userScreenName} component={UserScreen} options={{ headerShown: false }}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
};