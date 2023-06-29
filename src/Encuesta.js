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
  CheckBox,
  useToast,
} from 'native-base';
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';
import {test} from './utilidades/DatosG';
import {TabView, SceneMap} from 'react-native-tab-view';
import {View, useWindowDimensions, ImageBackground} from 'react-native';
import {RUTA_API, GetFormattedDate, formatoBanco} from './utilidades/utiles';
import {fontWeight} from 'styled-system';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Encuesta = ({navigation, route}) => {
  const [uno, setUno] = React.useState('');

  const [dos, setDos] = React.useState('');

  const [tres, setTres] = React.useState('');

  const [correo, setCorreo] = React.useState('');
  const [nombre, setNombre] = React.useState('');

  return (
    <NativeBaseProvider>
      <ImageBackground
        source={require('./imagenes/Login2.jpg')}
        resizeMode="cover">
        <HStack bg={'#FFF'}>
          <Text color={'#070C6B'} fontSize={25} p={4} pb={1} bold italic>
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
              px={2}
              bg="#FFF"
              pb={'18%'}
              pt={6}
              borderRadius={30}>
              <Center>
              <Text
                marginTop={1}
                textAlign={'center'}
                fontSize={28}
                color={'#070C6B'}
                italic
                Bold>
                {' '}
                Encuesta de satisfacción
              </Text>
              </Center>
              <Text
                marginTop={3}
                marginBottom={5}
                textAlign={'center'}
                fontSize={25}
                color={'#070C6B'}
                italic>
                {' '}
                Cliente #{test.data.caso.ec_cliente_codigo_lew}{' '}
              </Text>
              <Text
                marginTop={2}
                marginBottom={3}
                textAlign={'left'}
                fontSize={17}
                color="#154360"
                bold>
                ¿Se solucionó el problema satisfactoriamente?{' '}
              </Text>
              <TextArea
                bg="#FFF"
                value={uno}
                py={0}
                onChangeText={element => {
                  setUno(element);
                }}
              />

              <Text
                marginTop={2}
                marginBottom={3}
                textAlign={'left'}
                fontSize={17}
                color="#154360"
                bold>
                {' '}
                ¿La atención recibida fue cordial y profesional?{' '}
              </Text>
              <TextArea
                bg="#FFF"
                value={dos}
                py={0}
                onChangeText={element => {
                  setDos(element);
                }}
              />

              <Text
                marginTop={2}
                marginBottom={3}
                textAlign={'left'}
                fontSize={17}
                color="#154360"
                bold>
                {' '}
                ¿Verifico que la falla/inconveniente ha dejado de ocurrir
                fehacientemente?{' '}
              </Text>
              <TextArea
                bg="#FFF"
                value={tres}
                py={0}
                onChangeText={element => {
                  setTres(element);
                }}
              />

              <Text
                marginTop={2}
                marginBottom={3}
                textAlign={'left'}
                fontSize={17}
                color="#154360"
                bold>
                {' '}
                Nombre:{' '}
              </Text>
              <TextArea
                bg="#FFF"
                value={nombre}
                py={0}
                onChangeText={element => {
                  setNombre(element);
                }}
              />

              <Text
                marginTop={1}
                marginBottom={3}
                textAlign={'left'}
                fontSize={17}
                color="#154360"
                bold>
                {' '}
                correo electronico:{' '}
              </Text>
              <TextArea
                bg="#FFF"
                value={correo}
                py={0}
                onChangeText={element => {
                  setCorreo(element);
                }}
              />

              <Box alignItems={'center'}>
                <Button
                  mb={0}
                  _text={{
                    color: '#FFF',
                    fontSize: 'xl',
                    fontWeight: 'bold',
                  }}
                  width="80%"
                  bg="#070FAD"
                  borderRadius={50}
                  bold
                  mt={5}
                  onPress={() => {
                    fetch(`${RUTA_API}/insertarRespuestas`, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },

                      body: JSON.stringify({
                        orden: '1',
                        respuesta: uno,
                        id_caso_call_center: test.data.caso.ec_id,
                      }),
                    })
                      .then(res => res.json())
                      .then(result => {})
                      .catch(resp => {});

                    fetch(`${RUTA_API}/insertarRespuestas`, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },

                      body: JSON.stringify({
                        orden: '2',
                        respuesta: dos,
                        id_caso_call_center: test.data.caso.ec_id,
                      }),
                    })
                      .then(res => res.json())
                      .then(result => {})
                      .catch(resp => {});

                    fetch(`${RUTA_API}/insertarRespuestas`, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },

                      body: JSON.stringify({
                        orden: '3',
                        respuesta: tres,
                        id_caso_call_center: test.data.caso.ec_id,
                      }),
                    })
                      .then(res => res.json())
                      .then(result => {})
                      .catch(resp => {});

                    fetch(`${RUTA_API}/actualizarDatosEncuestado`, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },

                      body: JSON.stringify({
                        caso_call_center_id: test.data.caso.ec_id,
                        ec_nombre_encuestado: nombre,
                        ec_mail_encuestado: correo,
                      }),
                    })
                      .then(res => res.json())
                      .then(result => {
                        navigation.navigate({name: 'Firma'});
                      })
                      .catch(resp => {});
                  }}>
                  Enviar encuesta y firmar
                </Button>
              </Box>
            </Box>
          </ScrollView>
        </VStack>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

export default Encuesta;
