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
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

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
  const [permissionStatus, setPermissionStatus] = useState(null);

  let latitud;
  let longitud;

  const [tiempoTrabajado, setTiempoTrabajado] = React.useState();

  const minutosATiempo = minutos => {
    const leyenda = (numero, palabra, plural) =>
      numero === 0 || numero > 1
        ? `${numero} ${palabra}${plural || 's'}`
        : `${numero} ${palabra}`;
    const MINUTOS_POR_HORA = 60,
      HORAS_POR_DIA = 24,
      DIAS_POR_SEMANA = 7,
      DIAS_POR_MES = 30,
      MESES_POR_ANIO = 12;
    if (minutos < MINUTOS_POR_HORA) return leyenda(minutos, 'minuto');
    let horas = Math.floor(minutos / MINUTOS_POR_HORA),
      minutosSobrantes = minutos % MINUTOS_POR_HORA;
    if (horas < HORAS_POR_DIA)
      return (
        leyenda(horas, 'hora') +
        (minutosSobrantes > 0 ? ', ' + minutosATiempo(minutosSobrantes) : '')
      );
    let dias = Math.floor(horas / HORAS_POR_DIA);
    minutosSobrantes = minutos % (MINUTOS_POR_HORA * HORAS_POR_DIA);
    if (dias < DIAS_POR_SEMANA)
      return (
        leyenda(dias, 'día') +
        (minutosSobrantes > 0 ? ', ' + minutosATiempo(minutosSobrantes) : '')
      );
    let semanas = Math.floor(horas / (HORAS_POR_DIA * DIAS_POR_SEMANA));
    minutosSobrantes =
      minutos % (MINUTOS_POR_HORA * HORAS_POR_DIA * DIAS_POR_SEMANA);
    if (dias < DIAS_POR_MES)
      return (
        leyenda(semanas, 'semana') +
        (minutosSobrantes > 0 ? ', ' + minutosATiempo(minutosSobrantes) : '')
      );
    let meses = Math.floor(horas / (HORAS_POR_DIA * DIAS_POR_MES));
    minutosSobrantes =
      minutos % (MINUTOS_POR_HORA * HORAS_POR_DIA * DIAS_POR_MES);
    if (meses < MESES_POR_ANIO)
      return (
        leyenda(meses, 'mes', 'es') +
        (minutosSobrantes > 0 ? ', ' + minutosATiempo(minutosSobrantes) : '')
      );
    let anios = Math.floor(
      horas / (HORAS_POR_DIA * DIAS_POR_MES * MESES_POR_ANIO),
    );
    minutosSobrantes =
      minutos %
      (MINUTOS_POR_HORA * HORAS_POR_DIA * DIAS_POR_MES * MESES_POR_ANIO);
    return (
      leyenda(anios, 'año') +
      (minutosSobrantes > 0 ? ', ' + minutosATiempo(minutosSobrantes) : '')
    );
  };

  const opcionesFecha = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const [DeshabilitarTomarCaso, setDeshabilitarTomarCaso] =
    React.useState(false);

  const [estadoService, setestadoService] = React.useState('');

  const [contadorIniciado, setContadorIniciado] = React.useState(false);
  const [iniciarActivado, setIniciarActivado] = React.useState(false);
  const [finalizarDeshabilitado, setFinalizarDeshabilitado] =
    React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const [navegacion, setNavegacion] = React.useState(false);

  const [tiempo, setTiempo] = React.useState({
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  const traerHora = hora => {
    if (hora) {
      const fechaInicio = new Date(hora);

      console.log(fechaInicio);
      const intervalo = setInterval(() => {
        const ahora = new Date();
        const diferencia = ahora.getTime() - fechaInicio.getTime();

        // Cálculo de horas, minutos y segundos
        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
        const segundos = Math.floor((diferencia / 1000) % 60);

        // Actualizar el tiempo en el estado
        setTiempo({horas, minutos, segundos});
      }, 1000);

      // Limpieza del intervalo cuando el componente se desmonta
      return () => clearInterval(intervalo);
    }
  };

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

          //  console.log(data.visitas.length > 0);
          console.log('se lanza use effect de capturarserviceiniciado');
          data.visitas.length > 0
            ? data.visitas[0].estado == 0
              ? (setContadorIniciado(true),
                traerHora(data.visitas[0].fecha_inicio_service))
              : setContadorIniciado(false)
            : setContadorIniciado(false);

          data.visitas.length === 0 ? setIniciarActivado(true) : '';
        });
    } catch (error) {
      console.log('era este error');
    }
  }, [contadorIniciado]);

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
        data.visitas.length != null
          ? data.visitas[0].total > 0
            ? setTiempoTrabajado(data.visitas[0].total)
            : ''
          : '';
      });
  },[]);

  const iniciarContador = () => {
    let FechaActual = new Date();
    let hora = convertirFecha(FechaActual, true);

    traerHora(hora);
  };

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

  const solicitarPermisosUbicacion = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de ubicación',
          message:
            'Se requiere permiso de ubicación para acceder a la ubicación del dispositivo',
          buttonNeutral: 'Preguntar más tarde',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        obtenerUbicacion();
      } else {
        console.log('Permiso de ubicación denegado');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const obtenerUbicacion = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
    );
  };

  const tomarcaso = () => {
    let fechaHora = new Date();
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
  };

  const Retomarcaso = () => {
    let fechaHora = new Date();
    let TomaCaso = convertirFecha(fechaHora, true);

    fetch(`${RUTA_API}/RetomarCaso`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ec_id: test.data.caso.ec_id,
      }),
    })
      .then(res => res.json())
      .then(result => {
        //Alert.alert('CASO RETOMADO - DEBE INICIAR EL CRONOMETRO');
        // navigation.navigate({name: 'Casos'});
        fetch(`${RUTA_API}/tomarCasoHistorico`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_caso_call_center: test.data.caso.ec_id,
            fecha_tomado: TomaCaso,
            empleado_id: test.data.caso.ec_profesional_id,
          }),
        })
          .then(res => res.json())
          .then(result => {
            Alert.alert('CASO RETOMADO - DEBE INICIAR EL CRONOMETRO');
            navigation.navigate({name: 'Casos'});
          })
          .catch(resp => {
            Alert.alert('CASO NO TOMADO - INTENTE NUEVAMENTE');
          });
      })
      .catch(resp => {
        Alert.alert('CASO NO TOMADO - INTENTE NUEVAMENTE');
      });
  };

  const guardarGeo = () => {
    Geolocation.getCurrentPosition(
      position => {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
        fetch(`${RUTA_API}/insertarPosicion`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idCliente: test.data.caso.ec_cliente_codigo_lew,
            idEmpleado: test.data.caso.ec_profesional_id,
            idSistema: '43',
            longitudInicial: longitud,
            latitudInicial: latitud,
          }),
        })
          .then(res => res.json())
          .then(result => {
            console.log(result);
          })
          .catch(resp => {
            console.log('Error de fetch: ' + resp);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const insertarNuevaAtencion = () => {
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
        fetch(`${RUTA_API}/cambiarEstadoContadorIniciado`, {
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
          .then(result => {})
          .catch(resp => {
            Alert.alert(
              'No se pudo cambiar el estado del contador - Intente nuevamente',
            );
          }),
      )
      .then(result => {
        //console.log(test.data.caso.ec_id)
        // Alert.alert('CONTADOR INICIADO');
        //  navigation.navigate({name: 'Casos'});
      })
      .catch(resp => {
        Alert.alert('Contador no iniciado - Intente nuevamente');
      });
  };
  const actualizarFinAtencion = () => {
    setCargando(true);
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
        fetch(`${RUTA_API}/cambiarEstadoContadorDetenido`, {
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
        Alert.alert('Contador no detenido - Intente nuevamente');
        setCargando(false);
      });
  };

  useEffect(() => {
    if (navegacion) {
      navigation.navigate('DetalleService');
    }
  }, [navegacion]);

  return (
    <NativeBaseProvider>
      <ImageBackground
        source={require('./imagenes/Login2.jpg')}
        resizeMode="cover">
        <HStack bg={'#FFF'}>
          <Text color={'#070C6B'} fontSize={25} p={4} pb={1} bold italic>
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
              color={'#070C6B'}
              italic
              Bold>
              {' '}
              {test.data.caso.ec_cliente_razon_social}{' '}
            </Text>
            <Text
              marginTop={1}
              textAlign={'left'}
              fontSize={25}
              color={'#070C6B'}
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
              <Text
                rounded="lg"
                fontSize={20}
                color={'#070C6B'}
                textAlign="center">
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
                   // setHabilitarIniciarService(true);
                    // console.log(convertirFecha(fechaHora,true))

                    {
                      test.data.caso.ec_derivado == 0
                        ? tomarcaso()
                        : Retomarcaso();
                    }
                  }}>
                  {DeshabilitarTomarCaso
                    ? 'Caso tomado'
                    : 'Tomar caso telefonico'}
                </Button>
              ) : (
                <Box mb={2}>
                  {tiempoTrabajado && tiempoTrabajado > 0 && (
                    <Box
                      border={1}
                      borderColor="#0076D1"
                      bg="#0076D1"
                      alignItems={'center'}
                      mt={2}
                      mb={2}>
                      <Text
                        marginTop={1}
                        textAlign={'left'}
                        fontSize={20}
                        color="#fff"
                        italic
                        Bold>
                        Usted ya ha trabajado, {minutosATiempo(tiempoTrabajado)}{' '}
                        en este caso
                      </Text>
                    </Box>
                  )}
                  {contadorIniciado ? (
                    <Box>
                    <Center>
                      <Text mb={1} color="#B2BABB" fontSize={25} bold italic>
                        Atención actual:
                      </Text>
                      <Text mb={5} color="#B2BABB" fontSize={40} bold italic>
                        {`${tiempo.horas
                          .toString()
                          .padStart(2, '0')}:${tiempo.minutos
                          .toString()
                          .padStart(2, '0')}:${tiempo.segundos
                          .toString()
                          .padStart(2, '0')}`}
                      </Text>
                      </Center>
                      <Center>
                      <Button
                        bg={finalizarDeshabilitado ? '#121212' : '#239B56'}
                        _pressed={{bg: '#121212'}}
                        borderRadius={250}
                        size={250}
                        disabled={finalizarDeshabilitado}
                        onPress={() => {
                          setFinalizarDeshabilitado(true);
                          setCargando(true);
                          actualizarFinAtencion();
                        }}>
                        {cargando ? (
                          <ActivityIndicator size="large" color="#FFF" />
                        ) : (
                          <Text color="#FFF" fontSize="5xl" fontWeight="bold">
                            Finalizar
                          </Text>
                        )}
                      </Button>

                      </Center>

        
                    </Box>
                  ) : (
                    <Center>
                      {iniciarActivado ? (
                        <Button
                          mt={'25%'}
                          bg="#239B56"
                          _text={{
                            color: '#FFF',
                            fontSize: '5xl',
                            fontWeight: 'bold',
                          }}
                          disabled={!iniciarActivado}
                          onPress={() => {
                            iniciarContador();
                            setContadorIniciado(true);
                            setIniciarActivado(false);
                            insertarNuevaAtencion();
                            let FechaActual = new Date();
                            let actual = convertirFecha(FechaActual, true);
                            traerHora(actual);
                          }}
                          borderRadius={250}
                          size={250}>
                          Iniciar
                        </Button>
                      ) : (
                        <Box>
                          <ActivityIndicator size={100} color="#00ff00" />
                        </Box>
                      )}
                    </Center>
                  )}
                </Box>
              )}
            </HStack>

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
