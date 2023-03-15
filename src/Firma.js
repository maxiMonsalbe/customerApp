// Capture Digital Signature in React Native App for Android and iOS
// https://aboutreact.com/react-native-capture-signature/

// import React in our code
import React, {createRef, useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';
import {test} from './utilidades/DatosG';
import {RUTA_API} from './utilidades/utiles';
import SignatureCapture from 'react-native-signature-capture';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {RNSVGCircle} from 'react-native-svg';
import RNRestart from 'react-native-restart';

const Stack = createNativeStackNavigator();

const Firma = ({navigation}) => {
  const [Firmar, setFirmar] = React.useState();
  const sign = createRef();

  const saveSign = () => {
    sign.current.saveImage();
  };
  const resetSign = () => {
    sign.current.resetImage();
  };
  const _onSaveEvent = result => {
    const promise = new Promise(resolve => {
      const body = JSON.stringify({
        caso_call_center_id: test.data.caso.ec_id,
        ec_firma: result.encoded,
      });
      resolve(body);
    });
    promise.then(data => {
      fetch(`${RUTA_API}/insertarFirmaCodificada`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data,
      })
        .then(res => res.json())
        .then(() => {
        
              let fechaHora = new Date();
               let fechaHoraCierra = convertirFecha(fechaHora, true);

              fetch(`${RUTA_API}/cerrarCasoAtiende`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  caso_call_center_id: test.data.caso.ec_id,
                  ec_fecha_hora_cerrado:fechaHoraCierra,
                }),
              })
                .then(res => res.json())
                .then(result => {
                  Alert.alert('Caso cerrado exitosamente');
                  fetch(`${RUTA_API}/CrearOST`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      caso_call_center_id: test.data.caso.ec_id,
                      ec_fecha_hora_cerrado: fechaHoraCierra,
                    }),
                  })
                    .then(res => res.json())
                    .then(result => {
                      navigation.navigate({name: 'Casos'});
                    })
                    .catch(resp => {
                     console.log(resp);
                    });
                })
                .catch(resp => {
                  Alert.alert('No se pudo cerrar el caso - Intente nuevamente');
                });
        })
        .then(() => alert('Firmado conforme'));
    });
  };

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
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
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>Firma de conformidad</Text>
        <SignatureCapture
          style={styles.signature}
          ref={sign}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={'portrait'}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              saveSign();
              
            }}>
            <Text>Firmar y cerrar caso</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              resetSign();
            }}>
            <Text>Borrar</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              RNRestart.Restart();
              // navigation.navigate({ name: 'Casos' });
            }}>
            <Text>Volver</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Firma;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#154360',
    color: '#fff',
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#A09896',
    margin: 10,
  },
});
