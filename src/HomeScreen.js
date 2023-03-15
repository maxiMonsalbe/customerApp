import * as React from 'react';
import { View, Text, TouchableOpacity , Button} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'

function HomeScreen({ navigation }) {
    return(
        <View>
        <TouchableOpacity onPress={() => navigation.navigate ( 'Detalles')
        }>
         <Text> Hola desde HOMESCREEN</Text>
        </TouchableOpacity>

     
            
          


        </View>
    )
}

export default HomeScreen