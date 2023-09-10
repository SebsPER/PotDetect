import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView from 'react-native-maps';

export default function MapScreen({navigation}) {
    return(
        <View style={styles.container}>
            <MapView style={styles.map}>

            </MapView>
        </View>
    )
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    }
});