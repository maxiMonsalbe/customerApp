import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  RUTA_API,
  GetFormattedDate,
  formatoBanco,
  getData,
  reomoveItem,
} from './utilidades/utiles';
import {Link} from 'react-router-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RNRestart from 'react-native-restart';
import {
  Box,
  Button,
  Actionsheet,
  Divider,
  Image,
  Text,
  Progress,
  VStack,
  HStack,
  Center,
  Menu,
  HamburgerIcon,
  useToast,
  NativeBaseProvider,
  ScrollView,
  Modal,
  Input,
  Select,
  CheckIcon,
  FormControl,
  useDisclose,
  Pressable,
  Flex,
  Card,
} from 'native-base';
import {test} from './utilidades/DatosG';
import {
  ImageBackground,
  TouchableOpacity,
  requireNativeComponent,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';

//const Stack = createNativeStackNavigator();

const AtencionesDelCaso = ({navigation}) => {
  const [atenciones, setAtenciones] = React.useState('');

  const [habilitarIniciarService, setHabilitarIniciarService] =
    React.useState(false);

  const [estadoService, setestadoService] = React.useState(false);
  const [contadorIniciado, setContadorIniciado] = React.useState(false);

  function convertirTiempo(minutos) {
    if (minutos < 0) {
      return null;
    }

    let horas = Math.floor(minutos / 60);
    minutos = minutos % 60;

    minutos = minutos < 10 ? '0' + minutos : minutos;

    return horas + ':' + minutos;
  }
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

  function convertirTiempo(minutos) {
    if (minutos < 0) {
      return null;
    }

    let horas = Math.floor(minutos / 60);
    minutos = minutos % 60;

    minutos = minutos < 10 ? '0' + minutos : minutos;

    return horas + ':' + minutos;
  }

  React.useEffect(() => {
    //console.log("Empleado id " + test.data.usuario.id_usuario)

    fetch(`${RUTA_API}/atencionesDelCaso`, {
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
      .then(result => {
        // console.log(result.visitas)
        setAtenciones(result.atenciones);
        // console.log(" pantalla de casos")
      });
  }, []);
  // }, [casos]);

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

          data.visitas.length > 0
            ? data.visitas[0].estado == 0
              ? setContadorIniciado(true)
              : setContadorIniciado(false)
            : setContadorIniciado(false);
        });
    } catch (error) {}
  }, []);

  return (
    <NativeBaseProvider>
      <ImageBackground
        mt={'100%'}
        source={require('./imagenes/Login2.jpg')}
        style={styles.image}>
        <HStack bg={'#FFF'}>
          <Image
            borderRightRadius={100}
            resizeMode="stretch"
            size={'sm'}
            source={require('./imagenes/logoCustomer.png')}
            alt="customerservice"
          />
          <Text color={'#070C6B'} fontSize={24} p={3} pb={1} bold italic>
            Atenciones del caso: {test.data.caso.ec_id}
          </Text>
        </HStack>

        <ScrollView
          _contentContainerStyle={{
            px: '10px',
            pb: '100px',
            mb: '2',
          }}>
          <Text
            p={1}
            color="#FFF"
            textAlign={'center'}
            fontSize={25}
            bold
            bl="4%"
            m={1}></Text>

          {contadorIniciado ? (
          <Center>
            <Text textAlign={'center'}fontSize={25} color="#FFFFFF" fontWeight="bold">
              {' '}
             Tiene el contador de tiempo iniciado - Por favor detenga el contador y vuelva a intentarlo
            </Text>
            </Center>
          ) : (
            <VStack>
              {atenciones ? (
                atenciones.map((val, key) => {
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => {
                        test.data.caso = val;
                      }}>
                      <Box mb={4} borderRadius={10} bg="#fff" p={3}>
                        <VStack>
                          <Box alignSelf={'center'}>
                            <Text
                              fontSize={25}
                              color="#1A5276"
                              fontWeight="bold">
                              {' '}
                              Caso call center: {val.id_caso_call_center}
                            </Text>
                          </Box>
                          <Box alignSelf={'center'}>
                            <Text fontSize={20}>
                              Fecha/hora inicio:{' '}
                              {convertirFecha(val.fecha_inicio_service, true)}
                            </Text>
                            <Text fontSize={20}>
                              Fecha/hora fin:{' '}
                              {convertirFecha(val.fecha_fin_service, true)}
                            </Text>

                            <Text fontSize={20}>
                              Tiempo trabajado:{' '}
                              {convertirTiempo(val.TiempoTrabajado)}
                            </Text>
                            <Text fontSize={20}>
                              Informe realizado: {val.comentario}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Box>
                  <ActivityIndicator size={50} color="#00ff00" />
                </Box>
              )}
            </VStack>
          )}

          <Center>
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
              onPress={() => {
                navigation.navigate({name: 'Casos'});
              }}>
              Volver a pantalla principal
            </Button>
          </Center>
        </ScrollView>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default AtencionesDelCaso;
