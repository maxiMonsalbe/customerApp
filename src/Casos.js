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
} from 'native-base';
import {test} from './utilidades/DatosG';
import {
  ImageBackground,
  TouchableOpacity,
  requireNativeComponent,
  StyleSheet,
  View,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {ContinousBaseGesture} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
//import { TouchableOpacity } from 'react-native-gesture-handler';

//const Stack = createNativeStackNavigator();

const Casos = ({navigation}) => {
  const {isOpen, onOpen, onClose} = useDisclose();

  const [casos, setCasos] = React.useState('');
  const [actualizar, setActualizar] = React.useState(false);
  const [casoHace, setCasoHace] = React.useState();
  const [estadoService, setestadoService] = React.useState('');
  
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
        //obtenerUbicacion();
        console.log("permiso otorgado")
      } else {
        console.log('Permiso de ubicación denegado');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  


  const convertirFechaSINHORA = (fecha, Año) => {
    const fechaCaso = new Date(fecha);

    var dd = String(fechaCaso.getDate()).padStart(2, '0');

    var mm = String(fechaCaso.getMonth() + 1).padStart(2, '0');

    var yyyy = fechaCaso.getFullYear();

    return Año ? yyyy + '-' + mm + '-' + dd : dd + '-' + mm;
  };

  React.useEffect(() => {
   
    const unsubscribe = navigation.addListener('focus', () => {
      fetch(`${RUTA_API}/casosusuario`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: test.data.usuario.id_usuario,
        }),
      })
        .then(res => res.json())
        .then(result => {
          // console.log(result.visitas)
          setCasos(result.visitas);
          // console.log(" pantalla de casos")
        });
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(
    () =>
  
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
      }),
    [navigation],
  );

  React.useEffect(() => {
 
    fetch(`${RUTA_API}/casosusuario`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: test.data.usuario.id_usuario,
      }),
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result.visitas)
        setCasos(result.visitas);
        // console.log(" pantalla de casos")
      });
      solicitarPermisosUbicacion()
  }, [actualizar]);
  // }, [casos]);

  const calcularDias = fecha => {
  
    let fechaAhora = new Date();
    let ahora = convertirFechaSINHORA(fechaAhora, true);

    let fechaCreado = convertirFechaSINHORA(fecha, true);
    ahora = new Date(ahora);
    fechaCreado = new Date(fechaCreado);
    // console.log(calcularDiferenciaMinutos(ahora, fechaCreado) / 1440);

    let dif = (ahora.getTime() - fechaCreado.getTime()) / 1000 / 60;
    diferenciaDias = Math.abs(Math.round(dif)) / 1440;
    // console.log("diferencia en dias" + diferenciaDias);
    
    return (Math.abs(Math.round(dif)) / 1440);
  };

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
          <Text color="#3498DB" fontSize={25} p={4} pb={1} bold italic>
            Customer Service
          </Text>

          <Center ml={'3%'}>
            <Button ml={18} size={10} bg="#1A5276" onPress={onOpen}>
              <HamburgerIcon color="#FFF" size={30} />
            </Button>

            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content>
                <Box w="100%" h={60} px={4} justifyContent="center">
                  <Text
                    fontSize="16px"
                    color="gray.500"
                    _dark={{
                      color: 'gray.300',
                    }}>
                    OPCIONES
                  </Text>
                </Box>

                <Actionsheet.Item
                  _text={{color: '#21618C'}}
                  onPress={() => {
                    navigation.navigate({name: 'CasosCerrados'});
                  }}>
                  Ver casos cerrados
                </Actionsheet.Item>

                <Actionsheet.Item
                  _text={{color: '#21618C'}}
                  onPress={() => {
                    //RNRestart.Restart();
                    setActualizar(!actualizar);
                    onClose();
                  }}>
                  Actualizar
                </Actionsheet.Item>

                <Actionsheet.Item
                  _text={{color: '#21618C'}}
                  onPress={() => {
                    reomoveItem('datoUsuario');
                    RNRestart.Restart();
                  }}>
                  Cerrar Sesión
                </Actionsheet.Item>
              </Actionsheet.Content>
            </Actionsheet>
          </Center>
        </HStack>

        <ScrollView
          _contentContainerStyle={{
            px: '4px',
            pb: '100px',
            mb: '2',
          }}>
          <Center>
            <Text
              p={1}
              color="#FFF"
              textAlign={'center'}
              fontSize={25}
              bold
              bl="4%"
              m={1}>
              Casos Abiertos
            </Text>
          </Center>

          <VStack justifyContent="space-evenly">
            {casos ? (
              casos.map((val, key) => {
                return(
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      test.data.caso = val;
                     // console.log("tipo de caso" + test.data.caso.tipoCaso);

                      navigation.navigate({name: 'InformeCaso'});
                    }}>
                    <Box mb={5} borderRadius={10} bg="#fff" p={3}>
                      <VStack>
                        <Box>
                          <Text
                            textAlign={'right'}
                            fontSize={20}
                            marginRight={1}
                            color={'#1A5276'}
                            fontWeight="bold">
                            Tipo de atencion: {val.modo_resolucion}
                          </Text>
                        </Box>

                        <Box alignSelf={'center'}>
                          <Text fontSize={27} color="#1A5276" fontWeight="bold">
                            {' '}
                            Caso: {val.ec_id}
                          </Text>
                        </Box>
                        <Text
                          textAlign={'center'}
                          fontSize={20}
                          marginRight={1}
                          color={'#ED0A0A'}
                          fontWeight="bold">
                          {val.ct_nombre}
                        </Text>
                        <Box alignSelf={'center'}>
                          <Text fontSize={20} color={'#0B14D6'}>
                            Cliente: {val.ec_cliente_razon_social}
                          </Text>
                        </Box>

                        <Box>
                          <Text
                            alignSelf={'center'}
                            fontSize={18}
                            color={'#0B14D6'}>
                            {' '}
                            Equipo: {val.ec_equipo_nombre}
                          </Text>
                        </Box>

                        <Box>
                          <Text
                            textAlign={'right'}
                            marginTop={'5'}
                            marginRight={1}
                            color={'#1A5276'}
                            fontWeight="bold">
                            Estado: {val.ce_nombre}
                          </Text>
                          <HStack justifyContent="space-evenly">
                            <Text
                              textAlign={'left'}
                              marginBottom={1}
                              color={'#1A5276'}
                              fontSize={15}
                              fontWeight="bold">
                              Caso abierto hace:{' '}
                              {calcularDias(val.ec_caso_fecha_creado)} dias
                            </Text>
                            <Text
                              textAlign={'right'}
                              marginBottom={1}
                              color={'#1A5276'}
                              fontSize={15}
                              fontWeight="bold">
                              Contador: {val.estado}
                            </Text>
                          </HStack>

                          <Progress
                            colorScheme={
                              val.ce_nombre == 'Profesional'
                                ? 'yellow'
                                : val.ce_nombre ==
                                  'Profesional - Contador iniciado'
                                ? 'green'
                                : 'red'
                            }
                            value={
                              val.ce_nombre == 'Profesional'
                                ? '50'
                                : val.ce_nombre ==
                                  'Profesional - Contador iniciado'
                                ? '80'
                                : '5'
                            }
                            mt="1"
                            mx="2"
                          />
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

export default Casos;
