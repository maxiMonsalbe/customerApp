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
} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const CasosCerrados = ({navigation}) => {
  const {isOpen, onOpen, onClose} = useDisclose();

  const [casos, setCasos] = React.useState('');

  const [estadoService, setestadoService] = React.useState('');

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

  

  React.useEffect(() => {
   
    fetch(`${RUTA_API}/casosCerrados`, {
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
        setCasos(result.casosCerrados);
        // console.log(" pantalla de casos cerrados")
      });

      },[] );
 // }, [casos]);

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
        </HStack>

        <ScrollView
          _contentContainerStyle={{
            px: '10px',
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
              Casos Cerrados
            </Text>
          </Center>

          <VStack>
            {casos ? (
              casos.map((val, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      
                      test.data.caso = val;

                      navigation.navigate({name: 'DetalleCasoCerrado'});
                    }}>
                    <Box mb={5} borderRadius={10} bg="#fff" p={3}>
                      <VStack>
                        <Box alignSelf={'center'}>
                          <Text fontSize={25} color="#1A5276" fontWeight="bold">
                            {' '}
                            Caso: {val.ec_id}
                          </Text>
                        </Box>
                        <Box alignSelf={'center'}>
                          <Text fontSize={20}
                          color="#0B14D6">
                            Cliente: {val.ec_cliente_razon_social}
                          </Text>
                        </Box>

                        <Box>
                          <Text alignSelf={'center'}  fontSize={18}
                          color="#0B14D6">
                            {' '}
                            Equipo: {val.ec_equipo_nombre}
                          </Text>
                          <Text alignSelf={'center'}  fontSize={18} color="#0B14D6">
                            {' '}
                            Tiempo trabajado en el caso:  {convertirTiempo(val.Total)}{' '}
                          </Text>
                         
                        </Box>
                        

                        <Box>
                          <Text
                            textAlign={'right'}
                            marginTop={'5'}
                            marginBottom={1}
                            marginRight={1}
                            color={'#1A5276'}
                            fontWeight="bold">
                            Estado: {val.ce_nombre}
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

export default CasosCerrados;
