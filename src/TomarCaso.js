import React, {useState, useEffect} from 'react';
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
  Center,
  NativeBaseProvider,
  ScrollView,
  Modal,
  TextArea,
  useToast,
} from 'native-base';
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';
import {test} from './utilidades/DatosG';
import {TabView, SceneMap} from 'react-native-tab-view';
import {
  View,
  useWindowDimensions,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import {RUTA_API, GetFormattedDate, formatoBanco} from './utilidades/utiles';
import {fontWeight, justifyContent} from 'styled-system';
import Icon from 'react-native-vector-icons/FontAwesome';
//import IconFeather from 'react-native-vector-icons/Feather';

import RNRestart from 'react-native-restart';

const convertirFecha = (fecha, Año) => {
  var dd = String(fecha.getDate()).padStart(2, '0');

  var mm = String(fecha.getMonth() + 1).padStart(2, '0');

  var yyyy = fecha.getFullYear();

  //var hour = String(fecha.getHours() - 3);

  var hour = String(fecha.getHours());

  var min = String(fecha.getMinutes());

  var seg = String(fecha.getSeconds());

  return Año
    ? yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + min + ':' + seg
    : dd + '-' + mm;
};

//cerrarCaso
const TomarCaso = ({navigation, route}) => {
  //console.log(test.data.caso)

  const [casosCerrados, setCasosCerrados] = useState([]);
  const [Cerrar, setCerrarCaso] = React.useState('');
  const [Interna, setInterna] = React.useState('');
  //const [horaCerrado, setHoraCerrado] = React.useState()
  let diferenciaHora;
  let segundos;

  const [tiempoTrabajado, setTiempoTrabajado] = React.useState('');
  const opcionesFecha = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const [DeshabilitarTomarCaso, setDeshabilitarTomarCaso] =
    React.useState(false);

  const [habilitarIniciarService, setHabilitarIniciarService] =
    React.useState(false);
  const [habilitarDetenerService, setHabilitarDetenerService] =
    React.useState(false);

  const [estadoService, setestadoService] = React.useState('');

  React.useEffect(() => {
    try {
      fetch(`${RUTA_API}/capturarServiceIniciado`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_caso_call_center: test.data.caso.ec_id,
        }),
      })
        .then(res => res.json())
        .then(data => {
          setestadoService(data.visitas);
          //    console.log(data.visitas);

          //  console.log(data.visitas.length > 0);

          data.visitas.length > 0
            ? data.visitas[0].estado == 0
              ? setHabilitarIniciarService(true)
              : setHabilitarIniciarService(false)
            : setHabilitarIniciarService(false);
        });
    } catch (error) {
      console.log('era este error');
    }
  }, []);

  React.useEffect(() => {
    //suma todos los tiempos de los services
    fetch(`${RUTA_API}/capturarTiemposPorProfesional`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_caso_call_center: test.data.caso.ec_id,
        profesional_id: test.data.caso.ec_profesional_id,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // console.log("<<<<<<<<<<<" + data);
        setTiempoTrabajado(data.visitas);
        //  console.log(data.visitas);
        //   setTiempoTrabajado(res.capturarTiempos);
      });
  }, []);

  const handeLlamadaPress = async () => {
    await Linking.openURL(
      'tel:+54' + test.data.caso.ec_contacto_inicia_telefono,
    );
  };

  // const handeWhatsAppPress = async() =>{
  //     await Linking.openURL("https://wa.me/"+test.data.caso.ec_contacto_inicia_telefono)
  //}

  const handeWhatsAppPress = async () => {
    await Linking.openURL(
      'http://api.whatsapp.com/send?phone=54' +
        test.data.caso.ec_contacto_inicia_telefono,
    );
  };

  //envia detalles del caso a ese numero
  /* const handeWhatsAppPressCasoTomado = async() =>{
    await Linking.openURL(
        'https://wa.me/+542914040133?text=Caso tomado por: '+test.data.caso.ec_profesional + '- Cliente: '+test.data.caso.ec_cliente_razon_social + '- Equipo: '+test.data.caso.ec_equipo_nombre
      );
} */
  // elegir el chat y enviar detalles del caso
  // const handeWhatsAppPressCasoTomado = async() =>{
  //     await Linking.openURL(
  //         'https://wa.me/?text=Caso tomado por: '+test.data.caso.ec_profesional + '- Cliente: '+test.data.caso.ec_cliente_razon_social + '- Equipo: '+test.data.caso.ec_equipo_nombre
  //       );
  // }

  function secondsToString(seconds) {
    var hour = Math.floor(seconds / 3600);
    hour = hour < 10 ? '0' + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = minute < 10 ? '0' + minute : minute;
    var second = seconds % 60;
    second = second < 10 ? '0' + second : second;
    return hour + ':' + minute + ':' + second;
  }

  function convertirTiempo(minutos) {
    if (minutos < 0) {
      return null;
    }

    let horas = Math.floor(minutos / 60);
    minutos = minutos % 60;

    minutos = minutos < 10 ? '0' + minutos : minutos;

    return horas + ':' + minutos;
  }

  return (
    <NativeBaseProvider>
      <ImageBackground
        source={require('./imagenes/fondoazul.jpg')}
        resizeMode="cover">
        <HStack bg={'#FFF'}>
          <Text color={'#3498DB'} fontSize={25} p={4} pb={1} bold italic>
            Caso: {test.data.caso.ec_id}
          </Text>
          <Text
            color={'#3498DB'}
            fontSize={20}
            p={4}
            pb={1}
            marginLeft={20}
            bold
            italic>
            {test.data.caso.modo_resolucion}
          </Text>
        </HStack>
        <ScrollView
          _contentContainerStyle={{
            px: '10px',
            pb: '100px',
            mb: '2',
          }}>
          <Box
            size="95%"
            mt="5%"
            mx="3%"
            px={3}
            bg="#FFF"
            pb={'55%'}
            pt={6}
            borderRadius={30}>
            <Text
              marginTop={1}
              textAlign={'left'}
              fontSize={30}
              color="#5DADE2"
              italic
              Bold>
              {' '}
              {test.data.caso.ec_cliente_razon_social}{' '}
            </Text>
            <Text
              marginTop={1}
              textAlign={'left'}
              fontSize={25}
              color="#5DADE2"
              italic
              Bold>
              {' '}
              Reporta:{' '}
            </Text>

            <Box
              alignItems={'center'}
              mb={1}
              py={1}
              borderRadius={10}
              border={2}
              borderColor="#154360">
              <Text rounded="lg" fontSize={20} color="#000" textAlign="center">
                {test.data.caso.ec_objeto_de_llamado}
              </Text>
            </Box>
            <Text
              rounded="lg"
              color="#7F8C8D"
              borderColor="coolGray.200"
              fontSize={20}
              textAlign="left">
              Equipo:{' '}
              <Text
                marginBottom={8}
                rounded="lg"
                color="#4074138"
                borderColor="coolGray.200"
                fontSize={18}
                textAlign="left">
                {test.data.caso.ec_equipo_nombre}
              </Text>
            </Text>

            <Text
              rounded="lg"
              color="#7F8C8D"
              borderColor="coolGray.200"
              fontSize={20}
              textAlign="left">
              Numero de serie:{' '}
              <Text
                rounded="lg"
                color="#4074138"
                borderColor="coolGray.200"
                fontSize={18}
                textAlign="left">
                {test.data.caso.ec_equipo_cliente_nro_serie}
              </Text>
            </Text>
            <Text
              rounded="lg"
              color="#7F8C8D"
              borderColor="coolGray.200"
              fontSize={20}
              textAlign="left">
              Contactarse con:{' '}
              <Text
                rounded="lg"
                color="#4074138"
                borderColor="coolGray.200"
                fontSize={18}
                textAlign="left">
                {test.data.caso.ec_contacto_inicia_nombre_y_apellido}{' '}
              </Text>
            </Text>
            <Text
              rounded="lg"
              marginBottom={1}
              color="#7F8C8D"
              borderColor="coolGray.200"
              fontSize={20}
              textAlign="left">
              Numero de contacto:{' '}
              <Text
                rounded="lg"
                color="#4074138"
                borderColor="coolGray.200"
                fontSize={18}
                textAlign="left">
                {test.data.caso.ec_contacto_inicia_telefono}{' '}
              </Text>
            </Text>

            <HStack style={styles.iconContainer}>
              {test.data.caso.ec_caso_estado != 1 &&
              test.data.caso.ec_caso_estado != 7 ? (
                <Button
                  bg="#2874A6"
                  width="80%"
                  borderRadius={10}
                  mb={1}
                  disabled={DeshabilitarTomarCaso}
                  onPress={() => {
                    setDeshabilitarTomarCaso(true);
                    // setDeshabilitarIniciarService(false)
                    // let iniciaService = "00:00:00"
                    let fechaHora = new Date();
                    setHabilitarIniciarService(true);
                    // console.log(convertirFecha(fechaHora,true))
                    let TomaCaso = convertirFecha(fechaHora, true);
                    fetch(`${RUTA_API}/tomarCaso`, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        caso_call_center_id: test.data.caso.ec_id,
                        ec_fecha_hora_tomado: TomaCaso,
                      }),
                    })
                      .then(res => res.json())
                      .then(result => {
                        Alert.alert('CASO TOMADO - DEBE INICIAR EL CRONOMETRO');
                        navigation.navigate({name: 'Casos'});
                      })
                      .catch(resp => {
                        Alert.alert('CASO NO TOMADO - INTENTE NUEVAMENTE');
                      });
                  }}>
                  {DeshabilitarTomarCaso
                    ? 'Caso tomado'
                    : 'Tomar caso telefonico'}
                </Button>
              ) : (
                <Box mb={2}>
                  <Text
                    textAlign={'center'}
                    fontSize={30}
                    color="#5DADE2"
                    italic
                    Bold>
                    Contador de tiempo
                  </Text>
                  {estadoService ? (
                    <HStack justifyContent="space-evenly">
                      <Button
                        bg="#2874A6"
                        width="45%"
                        borderRadius={10}
                        mb={2}
                        isDisabled={habilitarIniciarService}
                        onPress={() => {
                          let fechaHora = new Date();
                          let iniciaService = convertirFecha(fechaHora, true);

                          fetch(`${RUTA_API}/insertarNuevaAtencion`, {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              id_caso_call_center: test.data.caso.ec_id,
                              fecha_inicio_service: iniciaService,
                              totalHoras: '0',
                              profesional_id: test.data.caso.ec_profesional_id,
                              finalizado: '0',
                            }),
                          })
                            .then(res => res.json())
                            .then(
                              fetch(
                                `${RUTA_API}/cambiarEstadoContadorIniciado`,
                                {
                                  method: 'POST',
                                  headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    caso_call_center_id: test.data.caso.ec_id,
                                  }),
                                },
                              )
                                .then(res => res.json())
                                .then(result => {
                                  console.log('contador iniciado');
                                })
                                .catch(resp => {
                                  Alert.alert(
                                    'No se pudo cambiar el estado del contador - Intente nuevamente',
                                  );
                                }),
                            )
                            .then(result => {
                              //console.log(test.data.caso.ec_id)
                              Alert.alert('CONTADOR INICIADO');
                              navigation.navigate({name: 'Casos'});
                            })
                            .catch(resp => {
                              Alert.alert(
                                'Contador no iniciado - Intente nuevamente',
                              );
                            });
                        }}>
                        Iniciar contador
                      </Button>
                      <Button
                        bg="#2874A6"
                        width="45%"
                        borderRadius={10}
                        mb={2}
                        isDisabled={!habilitarIniciarService}
                        onPress={() => {
                          let fechaHora = new Date();
                          let terminaService = convertirFecha(fechaHora, true);
                          fetch(`${RUTA_API}/actualizarFinAtencion`, {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              id: estadoService[0].id,
                              fecha_fin_service: terminaService,
                            }),
                          })
                            .then(res => res.json())
                            .then(result => {
                              fetch(
                                `${RUTA_API}/cambiarEstadoContadorDetenido`,
                                {
                                  method: 'POST',
                                  headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    caso_call_center_id: test.data.caso.ec_id,
                                  }),
                                },
                              )
                                .then(res => res.json())
                                .then(result => {
                                  console.log('contador detenido');
                                })
                                .catch(resp => {
                                  Alert.alert(
                                    'No se pudo cambiar el estado del contador - Intente nuevamente',
                                  );
                                }),
                                navigation.navigate({name: 'DetalleService'});
                            })
                            .catch(resp => {
                              Alert.alert(
                                'Contador no detenido - Intente nuevamente',
                              );
                            });
                        }}>
                        Detener contador
                      </Button>
                    </HStack>
                  ) : (
                    <Box>
                      <ActivityIndicator size={50} color="#00ff00" />
                    </Box>
                  )}
                </Box>
              )}
            </HStack>

            {tiempoTrabajado && (
              <Box
                border={1}
                borderColor="#0076D1"
                bg="#0076D1"
                alignItems={'center'}
                mb={20}>
                <Text
                  marginTop={1}
                  textAlign={'left'}
                  fontSize={20}
                  color="#fff"
                  italic
                  Bold>
                  Tiempo trabajado {convertirTiempo(tiempoTrabajado[0].total)}{' '}
                </Text>
              </Box>
            )}
            <HStack style={styles.iconContainer} justifyContent="space-evenly">
              <Icon.Button
                name="phone"
                size={42}
                onPress={handeLlamadaPress}
                backgroundColor="#3b5998">
                Llamar
              </Icon.Button>

              <Icon.Button
                name="whatsapp"
                size={42}
                onPress={handeWhatsAppPress}
                backgroundColor="#25B43A">
                WhatsApp
              </Icon.Button>
            </HStack>
            {/*  <VStack justifyContent="center">
              <Text
                marginTop={1}
                textAlign={'center'}
                fontSize={30}
                color="#5DADE2"
                italic
                Bold>
                Solución del caso:
              </Text>
              <TextArea
                bg="#FFF"
                containerStyle={styles.textareaContainer}
                borderRadius={10}
                ml="6%"
                h="200px"
                w="90%"
                style={styles.textarea}
                // textAlign={"center"}
                placeholder="Describa solución del caso"
                placeholderTextColor={'#CACFD2'}
                borderColor={'#B2BABB'}
                maxLength={5000}
                value={Cerrar}
                onChangeText={element => {
                  setCerrarCaso(element);
                }}
              />
              <Text
                marginTop={1}
                textAlign={'center'}
                fontSize={22}
                color="#5DADE2"
                italic
                Bold>
                Comunicación Interna:
              </Text>
              <TextArea
                bg="#FFF"
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                ml="6%"
                h="200px"
                w="90%"
                //  Text = {test.data.caso.ec_informe_trabajo}
                // textAlign={"center"}
                placeholder="Si es necesario inserte un comentario de uso interno"
                placeholderTextColor={'#CACFD2'}
                borderColor={'#B2BABB'}
                maxLength={5000}
                value={Interna}
                onChangeText={element => {
                  setInterna(element);
                }}
              />

              <Button
                isDisabled={!Cerrar}
                _text={{
                  color: '#FFF',
                  fontSize: 'xl',
                  fontWeight: 'bold',
                }}
                marginLeft={3}
                width="55%"
                bg="#0098da"
                bold
                mt={5}
                onPress={() => {
                  console.log(
                    'clic uno!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
                  );
                  setCerrarCaso(true);
                  let fechaHora = new Date();
                  // console.log(convertirFecha(fechaHora,true))
                  let fechaHoraCierra = convertirFecha(fechaHora, true);

                  fetch(`${RUTA_API}/cerrarCasoAtiende`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      caso_call_center_id: test.data.caso.ec_id,
                      ec_caso_solucion: Cerrar,
                      ec_informe_trabajo: Interna,
                      ec_fecha_hora_cerrado: fechaHoraCierra,
                    }),
                  })
                    .then(res => res.json())
                    .then(result => {
                      //navigation.navigate({ name: 'Casos' })
                    })
                    .catch(resp => {});

                  fetch(`${RUTA_API}/CrearOST`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      caso_call_center_id: test.data.caso.ec_id,
                    }),
                  })
                    .then(res => res.json())
                    .then(result => {
                      navigation.navigate({name: 'Casos'});
                    })
                    .catch(resp => {});
                }}>
                Finalizar caso telefónico
              </Button>
            </VStack> */}
          </Box>
        </ScrollView>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#33ffff',
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    textAlign: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    // textAlign: "center",
    backgroundColor: '#000000c0',
  },

  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: '#333',
  },

  textareaContainer: {
    height: 1000,
    padding: 5,
    backgroundColor: '#F5FCFF',
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: '#333',
  },
});
export default TomarCaso;
