import React from 'react';
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
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';
import {test} from './utilidades/DatosG';

import {View, useWindowDimensions, ImageBackground} from 'react-native';
import {RUTA_API, GetFormattedDate, formatoBanco} from './utilidades/utiles';
import {fontWeight} from 'styled-system';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const InformeCaso = ({navigation, route}) => {
  const [casoHace, setCasoHace] = React.useState();
  const [PuedeTelefonico, setPuedeTelefonico] = React.useState();
  false;

  // const opcionesFecha =  { weekday: 'long',  month: 'short', year: 'numeric', day: 'numeric' }

  // const ordenarFecha = () => {
  //     const fecha = new Date(test.data.caso.ec_caso_fecha_creado).toLocaleDateString(opcionesFecha)
  //     const dia= fecha.slice(0,2)
  //     const mes= fecha.slice(3,5)
  //     const año=fecha.slice(6)
  //     console.log(dia+"/"+mes+"/"+año)
  //     return dia+"/"+mes+"/"+año
  // }
  //ordenarFecha()

  const convertirFechaSINHORA = (fecha, Año) => {
    const fechaCaso = new Date(fecha);

    var dd = String(fechaCaso.getDate()).padStart(2, '0');

    var mm = String(fechaCaso.getMonth() + 1).padStart(2, '0');

    var yyyy = fechaCaso.getFullYear();

    return Año ? yyyy + '-' + mm + '-' + dd : dd + '-' + mm;
  };

  const casoAbiertoHace = () => {
    let fechaAhora = new Date();
    let ahora = convertirFechaSINHORA(fechaAhora, true);

    let fechaCreado = convertirFechaSINHORA(
      test.data.caso.ec_caso_fecha_creado,
      true,
    );
    ahora = new Date(ahora);
    fechaCreado = new Date(fechaCreado);
    // console.log(calcularDiferenciaMinutos(ahora, fechaCreado) / 1440);

    let dif = (ahora.getTime() - fechaCreado.getTime()) / 1000 / 60;
    diferenciaDias = Math.abs(Math.round(dif)) / 1440;
    // console.log("diferencia en dias" + diferenciaDias);
    setCasoHace(Math.abs(Math.round(dif)) / 1440);
  };

  const convertirFecha = (fecha, Año) => {
    const fechaCaso = new Date(fecha);

    var dd = String(fechaCaso.getDate()).padStart(2, '0');

    var mm = String(fechaCaso.getMonth() + 1).padStart(2, '0');

    var yyyy = fechaCaso.getFullYear();

    var hour = String(fechaCaso.getHours());

    if (hour >= 0 && hour <= 9) {
      hour = '0' + hour;
    }

    var min = String(fechaCaso.getMinutes());

    if (min >= 0 && min <= 9) {
      min = '0' + min;
    }

    var seg = String(fechaCaso.getSeconds());

    if (seg >= 0 && seg <= 9) {
      seg = '0' + seg;
    }

    return Año
      ? dd + '-' + mm + '-' + yyyy + ' ' + hour + ':' + min + ':' + seg
      : dd + '-' + mm;
  };

  const [deshabilitarTelefonico, setDeshabilitarTelefonico] =
    React.useState(false);

  React.useEffect(() => {
    fetch(`${RUTA_API}/capturarModoResolucion`, {
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
      .then(data => {
        // console.log("<<<<<<<<<<<" + data);
        // setTiempoTrabajado(data.visitas)
        //   setTiempoTrabajado(res.capturarTiempos);
        //console.log('Modo de Resolucion del caso:' + data.visitas);

        //si el modo es 2 = presencial, se desactiva el modo telefonico - no se puede volver a caso telefonico
        if (data.visitas[0].ec_modo_resolucion_caso == 2) {
          setDeshabilitarTelefonico(true);
        }

       // console.log('tipo' + data.visitas[0].ec_caso_tipo);
        if (
          data.visitas[0].ec_caso_tipo == 2 ||
          data.visitas[0].ec_caso_tipo == 3 ||
          data.visitas[0].ec_caso_tipo == 4 ||
          data.visitas[0].ec_caso_tipo == 5
        ) {
          setPuedeTelefonico(false);
        } else {
          setPuedeTelefonico(true);
        }
      });


      
    casoAbiertoHace();
  }, []);

  const reapertura = apertura => {
    if (apertura == 0) {
      return (apertura = 'No');
    } else {
      return (apertura = 'Si');
    }
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

        <VStack>
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
              <Text
                marginTop={1}
                textAlign={'center'}
                fontSize={30}
                color="#070C6B"
                italic
                Bold>
                {' '}
                {test.data.caso.ec_cliente_razon_social}{' '}
              </Text>
              <Text
                marginBottom={4}
                textAlign={'center'}
                fontSize={25}
                color="#070C6B"
                italic>
                {' '}
                Cliente #{test.data.caso.ec_cliente_codigo_lew}{' '}
              </Text>

              <Text
                marginTop={1}
                textAlign={'left'}
                fontSize={17}
                color="#070C6B">
                {' '}
                Contactarse con:{' '}
                {test.data.caso.ec_contacto_inicia_nombre_y_apellido}{' '}
              </Text>
              <Text
                marginTop={1}
                textAlign={'left'}
                fontSize={17}
                color="#070C6B">
                {' '}
                Comunicarse al: {
                  test.data.caso.ec_contacto_inicia_telefono
                }{' '}
              </Text>

              <Text
                marginTop={1}
                textAlign={'left'}
                fontSize={17}
                color="#070C6B">
                {' '}
                Por el equipo: {test.data.caso.ec_equipo_nombre}{' '}
              </Text>
              <Text
                marginTop={1}
                textAlign={'left'}
                fontSize={17}
                color="#070C6B">
                {' '}
                Nro. Serie: {test.data.caso.ec_equipo_cliente_nro_serie}{' '}
              </Text>

              <Text
                marginTop={1}
                textAlign={'left'}
                fontSize={17}
                color="#070C6B">
                {' '}
                Nos llamo la fecha:{' '}
                {convertirFecha(test.data.caso.ec_caso_fecha_creado, true)}{' '}
              </Text>
              <Text
                marginTop={1}
                textAlign={'left'}
                fontSize={17}
                color="#070C6B">
                Caso abierto hace: {casoHace} dias
              </Text>

              <Text
                marginTop={1}
                textAlign={'left'}
                fontSize={17}
                color="#070C6B">
                Caso reabierto: {reapertura(test.data.caso.ec_caso_reapertura)}
              </Text>
              

              <Text
                rounded="lg"
                marginTop={3}
                color="#070C6B"
                borderColor="coolGray.200"
                fontSize={20}
                bold
                textAlign="left">
                Nos reportó:
              </Text>

              <Box
                alignItems={'center'}
                mb={5}
                py={1}
                borderRadius={10}
                border={2}
                borderColor="#154360">
                <Text
                  rounded="lg"
                  fontSize={20}
                  color="#070C6B"
                  textAlign="center">
                  {test.data.caso.ec_objeto_de_llamado}
                </Text>
              </Box>

             
                {PuedeTelefonico ? (
                  <VStack>
                    <Button
                      _text={{
                        color: '#FFF',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                      }}
                      width="95%"
                      bg="#0B14D6"
                      borderRadius={10}
                      bold
                      mt={5}
                      disabled={deshabilitarTelefonico}
                      onPress={() => {
                        fetch(`${RUTA_API}/pasarTelefonico`, {
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
                            //console.log(test.data.caso.ec_id)
                            navigation.navigate({name: 'TomarCaso'});
                          })
                          .catch(resp => {});

                        console.log('pasa a modo solucion telefonico');
                        navigation.navigate({name: 'TomarCaso'});
                      }}>
                      Menú atención telefónica
                    </Button>

                    <Button
                      _text={{
                        color: '#FFF',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                      }}
                      width="95%"
                      bg="#070FAD"
                      borderRadius={10}
                      bold
                      mt={5}
                      //  disabled={DeshabilitarPresencial}
                      onPress={() => {
                        fetch(`${RUTA_API}/pasarPresencial`, {
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
                            //console.log(test.data.caso.ec_id)
                            navigation.navigate({name: 'TomarPresencial'});
                          })
                          .catch(resp => {});
                        console.log('pasa a modo solucion presencial');
                      }}>
                      Menú atencion presencial
                    </Button>
                  </VStack>
                ) : (
                  <VStack>
                    <Button
                      _text={{
                        color: '#FFF',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                      }}
                      width="95%"
                      bg="#070FAD"
                      borderRadius={10}
                      bold
                      mt={5}
                      //  disabled={DeshabilitarPresencial}
                      onPress={() => {
                        fetch(`${RUTA_API}/pasarPresencial`, {
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
                            //console.log(test.data.caso.ec_id)
                            navigation.navigate({name: 'TomarPresencial'});
                          })
                          .catch(resp => {});
                        console.log('pasa a modo solucion presencial');
                      }}>
                      Menú atencion presencial
                    </Button>
                  </VStack>
                )}

                <Button
                  _text={{
                    color: '#FFF',
                    fontSize: 'xl',
                    fontWeight: 'bold',
                  }}
                  width="95%"
                  bg="#070D89"
                  borderRadius={10}
                  bold
                  mt={5}
                  //   disabled={deshabilitado}
                  onPress={() => {
                    navigation.navigate({name: 'DerivarCaso'});
                   
                  }}>
                  Derivar caso
                </Button>
                <Button
                  _text={{
                    color: '#FFF',
                    fontSize: 'xl',
                    fontWeight: 'bold',
                  }}
                  width="95%"
                  bg="#070C6B"
                  borderRadius={10}
                  bold
                  mt={5}
                  //   disabled={deshabilitado}
                  onPress={() => {
                    navigation.navigate({name: 'AtencionesDelCaso'});
                  }}>
                  Ver atenciones del caso
                </Button>
            
            </Box>
          </ScrollView>
        </VStack>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

export default InformeCaso;
