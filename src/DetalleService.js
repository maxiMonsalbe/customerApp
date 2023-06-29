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
  Icon,
  Center,
  NativeBaseProvider,
  ScrollView,
  Modal,
  TextArea,
  useToast,
} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';
import {test} from './utilidades/DatosG';
import {TabView, SceneMap} from 'react-native-tab-view';
import {
  View,
  useWindowDimensions,
  ImageBackground,
  StyleSheet,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {RUTA_API, GetFormattedDate, formatoBanco} from './utilidades/utiles';
import {fontWeight} from 'styled-system';

//detalle service de atencion telefonica>>>>>>>>>>>>
const DetalleService = ({navigation, route}) => {
  const [trabajoRealizado, setTrabajoRealizado] = React.useState('');

  const [id, setId] = React.useState();
  const [correo, setCorreo] = React.useState();
  const [contacto, setContacto] = React.useState();
  const [tiempoTrabajado, setTiempoTrabajado] = React.useState();
  const [cargandoRetener, setCargandoRetener] = React.useState(false);
  const [cargandoFinalizar, setCargandoFinalizar] = React.useState(false);

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
        setTiempoTrabajado(data.visitas[0].total);
        console.log('TIEMPO:' + data.visitas);
        //   setTiempoTrabajado(res.capturarTiempos);
      });
  }, []);

  //no permite ir hacia atras, pero si navegar. import BackHandler
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'No puede abandonar esta pantalla, debe ingresar un detalle del trabajo realizado',
        );

        // Si estás en la pantalla en la que no quieres permitir el retroceso,
        // puedes mostrar una alerta o realizar alguna otra acción aquí.
        // Para este ejemplo, simplemente no hará nada cuando se presione el botón de retroceso.
        return true; // Retornar true evita que se realice el retroceso
      };

      // Agregar el evento de retroceso al montar el componente
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Eliminar el evento de retroceso al desmontar el componente
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  React.useEffect(() => {
    try {
      console.log(test.data.caso.ec_id);
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
          data.visitas.length > 0
            ? setId(data.visitas[0].id)
            : console.log(data.visitas);
        });
    } catch (error) {}
  }, []);

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
            pb={'35%'}
            pt={6}
            borderRadius={30}>
            <Center>
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
            </Center>

            <Text
              rounded="lg"
              color="#7F8C8D"
              borderColor="coolGray.200"
              fontSize={20}
              textAlign="left">
              Motivo llamado:{' '}
              <Text
                marginBottom={8}
                rounded="lg"
                color="#4074138"
                borderColor="coolGray.200"
                fontSize={18}
                textAlign="left">
                {test.data.caso.ec_objeto_de_llamado}
              </Text>
            </Text>
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
                marginBottom={8}
                rounded="lg"
                color="#4074138"
                borderColor="coolGray.200"
                fontSize={18}
                textAlign="left">
                {test.data.caso.ec_equipo_cliente_nro_serie}
              </Text>
            </Text>
            {tiempoTrabajado ? (
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
                  Tiempo total trabajado: {minutosATiempo(tiempoTrabajado)}
                </Text>
              </Box>
            ) : (
              <Box>
                <ActivityIndicator size={50} color="#00ff00" />
              </Box>
            )}
            <Text
              marginTop={1}
              textAlign={'left'}
              fontSize={20}
              color="#5DADE2"
              italic
              Bold>
              {' '}
              Detalle trabajo realizado:{' '}
            </Text>

            <VStack justifyContent="center">
              <TextArea
                bg="#FFF"
                ml="6%"
                h="200px"
                w="90%"
                mb={1}
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                // textAlign={"center"}
                placeholder={'Indique el trabajo'}
                placeholderTextColor={'#CACFD2'}
                borderColor={'#B2BABB'}
                maxLength={5000}
                value={trabajoRealizado}
                onChangeText={element => {
                  setTrabajoRealizado(element);
                }}
              />
              <Text
                mt={1}
                mb={0}
                bold
                color="#BDBFC1"
                fontSize={10}
                textAlign={'left'}>Opcional:
              </Text>
              <Text
                mt={0}
                mb={1}
                bold
                color="#BDBFC1"
                fontSize={20}
                textAlign={'left'}>
                Nombre de contacto:
              </Text>
              <Input
                borderRadius={10}
                variant="outline"
                //variant="filled"
                placeholder="Ingrese nombre del contacto"
                textAlign={'center'}
                mb={2}
                value={contacto}
                onChangeText={element => {
                  setContacto(element);
                }}
              />
              <Text
                mt={1}
                mb={1}
                bold
                color="#BDBFC1"
                fontSize={20}
                textAlign={'left'}>
                Enviar orden de servicio a:
              </Text>
              <Input
                borderRadius={10}
                variant="outline"
                //variant="filled"
                placeholder="Ingrese correo para enviar Orden de servicio"
                textAlign={'center'}
                mb={2}
                value={correo}
                onChangeText={element => {
                  setCorreo(element);
                }}
              />
            </VStack>

            <HStack space={5} justifyContent="center">
              <Button
                bg={!trabajoRealizado ? '#121212' : '#239B56'}
                _pressed={{bg: '#121212'}}
                _text={{
                  color: '#FFF',
                  fontSize: 'xl',
                  fontWeight: 'bold',
                }}
                marginLeft={3}
                marginBottom={20}
                width="40%"
                bg="#070FAD"
                bold
                mt={5}
                onPress={() => {
                  setCargandoRetener(true);
                  //console.log('-----------' + id);
                  let terminaService = '00:00';

                  fetch(`${RUTA_API}/actualizarComentarioFin`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      id: id,
                      //id_caso_call_center: test.data.caso.ec_id,
                      finalizado: '1',
                      comentario: trabajoRealizado,
                    }),
                  })
                    .then(res => res.json())
                    .then(result => {
                      Alert.alert(
                        'El informe del trabajo realizado se guardo correctamente',
                      );
                      navigation.navigate({name: 'Casos'});
                    })
                    .catch(resp => {
                      Alert.alert(
                        'No se pudo guardar el informe del trabajo realizado - Intente nuevamente',
                      );
                    });
                }}>
                {cargandoRetener ? (
                  <ActivityIndicator size="large" color="#FFF" />
                ) : (
                  <Text color="#FFF" fontSize="xl" fontWeight="bold">
                    Retener Atención
                  </Text>
                )}
              </Button>

              <Button
                isDisabled={!trabajoRealizado}
                _text={{
                  color: '#FFF',
                  fontSize: 'xl',
                  fontWeight: 'bold',
                }}
                marginLeft={3}
                marginBottom={20}
                width="40%"
                bg="#070FAD"
                bold
                mt={5}
                onPress={() => {
                  setCargandoFinalizar(true);
                 
                  let fechaHora = new Date();
                  let fechaHoraCierra = convertirFecha(fechaHora, true);
                  fetch(`${RUTA_API}/actualizarComentarioFin`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      id: id,
                      finalizado: '1',
                      comentario: trabajoRealizado,
                    }),
                  })
                    .then(res => res.json())
                    .then(result => {
                      fetch(`${RUTA_API}/ActualizarTrabajoDelCaso`, {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          ec_id: test.data.caso.ec_id,
                          ec_caso_solucion: trabajoRealizado,
                          ec_informe_trabajo: '',
                          ec_fecha_hora_cerrado: fechaHoraCierra,
                          ec_mail_encuestado: correo,
                          ec_nombre_encuestado: contacto,
                        }),
                      })
                        .then(res => res.json())
                        .then(result => {
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
                            .then(result => {})
                            .catch(resp => {
                              Alert.alert(
                                'No se pudo crear la orden de servicio - comuniquese con el area de sistemas internos',
                              );
                            });

                          Alert.alert('Caso cerrado exitosamente');
                          navigation.navigate({name: 'Casos'});
                        })
                        .catch(resp => {
                          Alert.alert(
                            'No se pudo cerrar el caso - Intente nuevamente',
                          );
                        });
                    })
                    .catch(resp => {
                      Alert.alert(
                        'No se pudo guardar el informe del trabajo realizado',
                      );
                    });
                }}>
                {cargandoFinalizar ? (
                  <ActivityIndicator size="large" color="#FFF" />
                ) : (
                  <Text color="#FFF" fontSize="xl" fontWeight="bold">
                    Finalizar caso
                  </Text>
                )}
              </Button>
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
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
  textareaContainer: {
    height: 180,
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
export default DetalleService;
