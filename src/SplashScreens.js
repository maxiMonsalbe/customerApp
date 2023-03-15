import React, { useEffect } from 'react';
import { RUTA_API, getData, storeData,reomoveItem } from './utilidades/utiles';
import {
  Input,
  Button,
  IconButton,
  Checkbox,
  Text,
  VStack,
  HStack,
  Heading,
  Icon,
  Center,
  NativeBaseProvider,
  useToast
} from "native-base"
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { ImageBackground, Animated, View, StyleSheet, SafeAreaView, ToastAndroid } from "react-native";
import * as Animatable from 'react-native-animatable'

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import { test } from "./utilidades/DatosG"

const Stack = createNativeStackNavigator();

const SplashScreens = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      //reomoveItem('datoUsuario')  //En caso de emergencia 
      

      (getData('datoFecha'))
        .then((dataFecha) => {
          if (dataFecha != null) {
            let hoy = new Date(Date.now())
            if (dataFecha == hoy.getDate()) {
              getData('datoUsuario')
                .then((dataUsuario) => {
                  
                  if (dataUsuario != null) {
                    test.data.usuario = dataUsuario.user
                    test.data.progreso = []
                    test.data.token = dataUsuario.token
                    navigation.navigate ("Casos");
                    //history.push("/visitasprogramadas")
                  } else {
                    navigation.navigate ("Login");
                  
                  }
                })
                getData('datosRechazados')
                .then((datosRechazados) => {
                })
            } else {
              navigation.navigate ("Login");
            
            }
          } else {
    
            navigation.navigate ("Login");
          }
        })

    }, 3000);

  }, []);

  return (

    <ImageBackground source={require('./imagenes/fondoazul.jpg')} resizeMode={"cover"} p={2} style={styles.image}  >
      <Center flex={1}>
        <Animatable.Image
          
          resizeMode="contain"
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          borderRadius={100}
          style={{
            width: 200,
            height: 200,
            margin: 50,


          }}
          source={require('./imagenes/logoCustomer.png')}
        />
      </Center>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  }
});


export default SplashScreens;