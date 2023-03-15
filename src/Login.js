import React, { useState, useEffect } from 'react'
import {TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack'

import { RUTA_API, getDate, storeData, jstoreData } from './utilidades/utiles';

import { test } from './utilidades/DatosG';

import {
    Input,
    Image,
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
    useToast,
    Stack,
    Box,
    ScrollView,
    View
} from "native-base"




const Login = ({ navigation }) => {
    const [show, setShow] = React.useState(false)
    const [usuario, setUsuario] = React.useState("")
    const [pass, setPass] = React.useState("")
    const handleClick = () => setShow(!show)
    const [estado, setEstado] = React.useState(false)
    const toast = useToast()
const login = () => {


        setEstado(true)
        fetch(`${RUTA_API}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user": usuario,
                "password": pass
            })
        })
            .then(res => res.json())
            .then((result) => {
                if (result.Ingresa === false) {
                    setEstado(false)
                    toast.show({
                        title: "Algo salió mal",
                        status: "error",
                        description: "Verifique datos de usuario",
                    })
                } else {
                    console.log("llego aca")
                    storeData('datoUsuario', result)
                    test.data.usuario = result.user
                    test.data.token = result.token
                    setEstado(false)

                    //Falta agregar permisos
                    let Hoy = new Date()
                    storeData('datoFecha', Hoy.getDate())
                    navigation.navigate ("Casos");
                 
                    toast.show({
                        title: `Acceso Verificado`,
                        status: "success",
                        description: `Bienvenido ${result.user.usuario}`,

                    })
                }


            }, (error) => {
                setEstado(false)
                toast.show({
                    title: "Algo salió mal",
                    status: "error",
                    description: "No posee conexión a internet1",
                })
            }
            ).catch(resp => {
                setEstado(false)
                toast.show({
                    title: "Algo salió mal",
                    status: "error",
                    description: "No posee conexión a internet2", //llega hasta aca posiblie history puse
                })
            })
    }

    return(
        <NativeBaseProvider>
             <ImageBackground source={require('./imagenes/Login2.jpg')} resizeMode={"cover"} p={2} style={styles.image}  >
             <Center flex={1} h="20%" m={1}>
                <VStack paddingLeft={4} paddingRight={4} space={4} flex={2} w="100%" >
                   
                    <Text mt={45} mb={5} bold color="#BDBFC1" fontSize={40} textAlign={"center"} italic>Customer Service</Text>  
                    <Input
                        borderRadius={20}
                        variant="outline"
                        //variant="filled"
                        placeholder="Usuario"
                        color={"#ffffff"}
                        textAlign={"center"}
                        value={usuario}
                        onChangeText={(text) => setUsuario(text)}
                        mb={2}
                    />
                    <Input
                        borderRadius={20}
                        variant="outline"
                        //variant="filled"
                        value={pass}
                        color={"#ffffff"}
                        onChangeText={(text) => setPass(text)}
                        type={show ? "text" : "password"}
                        placeholder="Contraseña"
                        textAlign={"center"}
                        mb={5}
                    />
                    <Button bg={"#092661"} opacity={0.7} borderRadius={20} onPress={login} textoBase="Ingresar" textoEvento="Ingresando" estado={estado} >
                        <Text color="#ffffff" bold fontSize={"xl"} >Ingresar</Text>
                    </Button> 
                    
                    <Box alignItems="center" pt={0} pb={1} >
                    <Text mt={340} bold color="#BDBFC1" fontSize={15} italic>Customer Service - Bernardo Lew 2023</Text>
                    <Text mt={1} bold color="#BDBFC1" fontSize={15} italic>v4</Text>
                    
                    </Box>
                </VStack>
            </Center>
             </ImageBackground>
        </NativeBaseProvider>

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

export default Login