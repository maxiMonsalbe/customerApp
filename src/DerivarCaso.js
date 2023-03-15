import React, { useState, useEffect } from 'react'
import {
    Input,
    Box,
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
    ScrollView,
    Modal,
    TextArea,
    useToast

} from "native-base"
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { test } from './utilidades/DatosG'

import { View, useWindowDimensions, ImageBackground, StyleSheet } from 'react-native';
import { RUTA_API, GetFormattedDate, formatoBanco } from './utilidades/utiles'
import { fontWeight } from 'styled-system';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();

const convertirFecha = (fecha, Año) => {

    var dd = String(fecha.getDate()).padStart(2, "0");

    var mm = String(fecha.getMonth() + 1).padStart(2, "0");

    var yyyy = fecha.getFullYear();
    
    var hour = String(fecha.getHours() - 3);

    var min = String(fecha.getMinutes());
    
    var seg = String(fecha.getSeconds());

    return Año ? yyyy + "-" + mm + "-" + dd + " " + hour + ":" + min + ":" + seg: dd + "-" + mm;

  };


const DerivarCaso = ({ navigation, route }) => {

    const [comentario, setComentario] = React.useState("")
    const [profesional, setProfesional] = React.useState("")
  
  
  

    //{test.data.caso.ec_caso_fecha_creado}
    return (
        <NativeBaseProvider>
            <ImageBackground source={require('./imagenes/fondoazul.jpg')} resizeMode="cover"  >
                <HStack bg={"#FFF"}>

                    <Text color={"#3498DB"} fontSize={25} p={4} pb={1} bold italic>Caso: {test.data.caso.ec_id}</Text>

                </HStack>
                <ScrollView
                        _contentContainerStyle={{
                            px: "10px",
                            pb: "100px",
                            mb: "2",

                        }}
                    >
                    <Box size="95%" mt='5%' mx="3%" px={3} bg="#FFF" pb={"35%"} pt={6} borderRadius={30}>

                        <Text  marginTop={1}  textAlign={"center"} fontSize={30} color='#5DADE2' italic Bold > Derivar Caso: </Text>
                        <Text  rounded="lg" color="#7F8C8D" borderColor="coolGray.200" fontSize={25} textAlign="center">Cliente:</Text>
                        <Text marginBottom={8} rounded="lg" color="#7F8C8D" borderColor="coolGray.200" fontSize={25} textAlign="center">{test.data.caso.ec_cliente_razon_social}
                        </Text> 

                
                        <HStack justifyContent="center">
                            <TextArea bg="#FFF"
                                ml="6%"
                                h="200px"
                                w="90%"
                                mb={10}
                                containerStyle={styles.textareaContainer}
                                style={styles.textarea}
                                // textAlign={"center"}
                                placeholder={'Motivo de la derivación'}
                                placeholderTextColor={'#CACFD2'}
                                borderColor={"#B2BABB"}
                                maxLength={5000}
                                value={comentario}
                                onChangeText={(element) => {
                                    setComentario(element)
                                    setProfesional(test.data.caso.ec_profesional_id)
                                }}
                            />
                        </HStack>

                        <HStack space={5} justifyContent="center">
                            <Button
                            isDisabled={!comentario}
                                _text=
                                {{
                                    color: "#FFF",
                                    fontSize: "xl",
                                    fontWeight: "bold"
                                }}
                                marginLeft={3}
                                marginBottom={20}
                                width="55%"
                                bg="#0098da"
                                bold mt={5}
                                onPress={() => {
                                    let fechaHora = new Date();
                                   let fechaHoraDeriva = convertirFecha(fechaHora,true)   
                                    fetch(`${RUTA_API}/insertarCasoDerivado`, {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            "id_caso_call_center": test.data.caso.ec_id,
                                            "motivo_derivacion": comentario,
                                            "fecha_hora_derivado": fechaHoraDeriva,                                      
                                            "empleado_id": profesional
                                
                                        })
                                    })
                                        .then(res => res.json())
                                        .then((result) => {
                                            console.log("clic derivado")
                                         
                                        }).catch(resp => {
                                            console.log("ERROR")
                                        })

                                        fetch(`${RUTA_API}/derivarCaso`, {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            "caso_call_center_id": test.data.caso.ec_id,
                                            "ec_informe_trabajo": comentario,
                                        })
                                    })
                                        .then(res => res.json())
                                        .then((result) => {
                                            console.log("clic derivado")
                                            navigation.navigate({ name: 'Casos' })
                                        }).catch(resp => {
                                            console.log("ERROR")

                                        })

                                }}

                            >Derivar call center
                            </Button>


                        </HStack>
                    </Box>
                </ScrollView>
            </ImageBackground>

        </NativeBaseProvider>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#33ffff'
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
    },
    textareaContainer: {
        height: 180,
        padding: 5,
        backgroundColor: '#F5FCFF',
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: 170,
        fontSize: 14,
        color: '#333',
    },
});
export default DerivarCaso;