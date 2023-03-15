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



const DetalleCasoCerrado = ({navigation, route}) => {

  const [tiempoTrabajado, setTiempoTrabajado] = React.useState('');


  


  function secondsToString(seconds) {
    var hour = Math.floor(seconds / 3600);
    hour = hour < 10 ? '0' + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = minute < 10 ? '0' + minute : minute;
    var second = seconds % 60;
    second = second < 10 ? '0' + second : second;
    return hour + ':' + minute + ':' + second;
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


  return (
    <NativeBaseProvider>
      <ImageBackground
        source={require('./imagenes/fondoazul.jpg')}
        resizeMode="cover">
        <HStack bg={'#FFF'}>
          <Text color={'#3498DB'} fontSize={25} p={4} pb={1} bold italic>
            Caso: {test.data.caso.ec_id}
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
                color="#5DADE2"
                italic
                Bold>
                {' '}
                {test.data.caso.ec_cliente_razon_social}{' '}
              </Text>
              <Text
                marginBottom={5}
                textAlign={'center'}
                fontSize={25}
                color="#154360"
                italic>
                {' '}
                Cliente #{test.data.caso.ec_cliente_codigo_lew}{' '}
              </Text>
              <Text
                marginTop={2}
                marginBottom={1}
                textAlign={'left'}
                fontSize={17}
                color="#191919">
                {' '}
                Se Contactó:{' '}
                {test.data.caso.ec_contacto_inicia_nombre_y_apellido}{' '}
              </Text>
              <Text
                marginTop={2}
                marginBottom={1}
                textAlign={'left'}
                fontSize={17}
                color="#191919">
                {' '}
                Telefono: {test.data.caso.ec_contacto_inicia_telefono}{' '}
              </Text>

              <Text
                marginTop={2}
                marginBottom={1}
                textAlign={'left'}
                fontSize={17}
                color="#191919">
                {' '}
                Por el equipo: {test.data.caso.ec_equipo_nombre}{' '}
              </Text>
              <Text
                marginTop={2}
                marginBottom={1}
                textAlign={'left'}
                fontSize={17}
                color="#191919">
                {' '}
                Nro. Serie: {test.data.caso.ec_equipo_cliente_nro_serie}{' '}
              </Text>

              <Text
                marginTop={2}
                marginBottom={1}
                textAlign={'left'}
                fontSize={17}
                color="#191919">
                {' '}
                Nos llamo la fecha:{' '}
                {convertirFecha(test.data.caso.ec_caso_fecha_creado, true)}{' '}
              </Text>

              <Text
                rounded="lg"
                marginBottom={1}
                color="#154360"
                borderColor="coolGray.200"
                fontSize={20}
                textAlign="left">
                Nos reportó:
              </Text>

              
              <Box
                alignItems={'center'}
                mb={5}
                py={2}
                borderRadius={10}
                border={2}
                borderColor="#154360">
                <Text
                  rounded="lg"
                  fontSize={20}
                  color="#000"
                  textAlign="center">
                  {test.data.caso.ec_objeto_de_llamado}
                </Text>
              </Box>

              <Text
                rounded="lg"
                marginBottom={1}
                color="#154360"
                borderColor="coolGray.200"
                fontSize={20}
                textAlign="left">
                Solución del caso:
              </Text>
              <Box
                alignItems={'center'}
                mb={5}
                py={2}
                borderRadius={10}
                border={2}
                borderColor="#154360">
                <Text
                  rounded="lg"
                  fontSize={20}
                  color="#000"
                  textAlign="center">
                  {test.data.caso.ec_caso_solucion}
                </Text>
              </Box>



              <Text
                marginTop={2}
                marginBottom={1}
                textAlign={'left'}
                fontSize={17}
                color="#191919">
          
                Caso cerrado el dia:{' '}
                {convertirFecha(test.data.caso.ec_caso_fecha_creado, true)}{' '}
             
              </Text>
             
              <Text
                marginTop={2}
                marginBottom={1}
                textAlign={'left'}
                fontSize={17}
                color="#191919">
          
               Tiempo trabajado:{' '}
               {convertirTiempo(test.data.caso.Total)}
               
             
              </Text>
              <Button
                  _text={{
                    color: '#FFF',
                    fontSize: 'xl',
                    fontWeight: 'bold',
                  }}
                  width="95%"
                  bg="#2874A6"
                  borderRadius={10}
                  bold
                  mt={5}
                  onPress={() => {navigation.navigate({name: 'Casos'});}}>
                 Volver a pantalla principal
                </Button>
            </Box>
            
          </ScrollView>
        </VStack>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

export default DetalleCasoCerrado;
