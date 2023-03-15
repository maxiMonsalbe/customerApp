import React from 'react'
import { Image } from 'react-native';
import { TouchableOpacity, PermissionsAndroid } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RUTA_API, GetFormattedDate, formatoBanco, getData, reomoveItem } from './utilidades/utiles'
import { test } from './utilidades/DatosG'
import logo from '../src/imagenes/logoOrden.png'






const Stack = createNativeStackNavigator();
const OST = () => {

  React.useEffect(() => {
    //console.log("Empleado id " + test.data.usuario.id_usuario)
  
    fetch(`${RUTA_API}/consultarCasoCerrado`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "caso_call_center_id": test.data.caso.ec_id,
        })
    })
        .then(res => res.json())
        .then((result) => {
           
          
          
        })
  
  
  },);

  const data = {
    logo: logo,
    Caso: `${test.data.caso.ec_id}`,
    razonsocial:  `${test.data.caso.ec_cliente_razon_social}`,
    codigoLew: `${test.data.caso.ec_cliente_codigo_lew}`,
    equipo:  `${test.data.caso.ec_equipo_nombre}`,
    numeroSerie:  `${test.data.caso.ec_equipo_cliente_nro_serie}`,
    atencion:  `${test.data.caso.ec_tipo_atencion}`,
    objetoLlamado:  `${test.data.caso.ec_objeto_de_llamado}`,
    profesional:  `${test.data.caso.ec_profesional}`,
    profesionalId:  `${test.data.caso.ec_profesional_id}`,
    fechaCreado:  `${test.data.caso.ec_caso_fecha_creado}`,
    modoResolucion:  `${test.data.caso.ec_modo_resolucion_caso}`,
    contactoInicia:  `${test.data.caso.ec_contacto_inicia_nombre_y_apellido}`,
    contactoIniciaTel:  `${test.data.caso.ec_contacto_inicia_telefono}`,
    informeTrabajo:  `${test.data.caso.ec_informe_trabajo}`,
    fechaHoraTomado:  `${test.data.caso.ec_fecha_hora_tomado}`,
    solucion:  `${test.data.caso.ec_caso_solucion}`,
    fechaHoraCerrado:  `${test.data.caso.ec_fecha_hora_cerrado}`,
  }
  

  const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>Invoice</title>
            <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
            <style>
              ${htmlStyles}
            </style>
          </head>
          <body>

            <div style="margin-bottom:20pt">
                 <img src="M:\Repositorio\CustomerApp\customerApp\src\imagenes\logo2.jpg alt="Image" height="42" width="42">

            </div>
              <p>
                 Orden N°: ${data.Caso}
              </p>
          
              <h1>Orden de servicio</h1>
              <br>
                <table>
                    <tbody>
                    <tr>
                    <td>
                      clienteee:  ${data.razonsocial}
                    </td>

                    <td>
                      Codigo Lew: ${data.codigoLew}
                    </td>

                    </tr>

                    <tr>
                    <td>
                      Direccion: zapiola 757
                    </td>

                    <td>
                      Telefono: 154040133
                    </td>

                    </tr>
                    </tbody>
                  </table>
              <br>
              <br>
              <hr>
              <p style="border: ridge #BDBFC1 4px; padding: 1em;">  
                Cliente:<br>
                Codigo Lew: <br>
              </p>
              <br>
              <br>
              <p style="border: ridge #BDBFC1 4px; padding: 1em;"> 
                Equipo: ${data.equipo}<br>
                Numero de serie: ${data.numeroSerie}<br>
                Tipo de servicio: ${data.ec_tipo_atencion}<br>
              </p>
              <br>
              <br>
              <p style="border: ridge #BDBFC1 4px; padding: 1em;">  
                Comentarios del solicitante: ${data.contactoInicia}<br>
                ${data.objetoLlamado}<br>
              </p>
              <br>
              <br>
              <p style="border: ridge #BDBFC1 4px; padding: 1em;">  
                Informe de trabajo realizado: ${data.solucion}<br>                
              </p>
              <br>
              <br>
              <p style="border: ridge #BDBFC1 4px; padding: 1em;">  
                Fecha y hora tomado: ${data.fechaHoraTomado}<br>
                Fecha y hora cerrado: ${data.fechaHoraCerrado}<br>               
              </p>


                
         
            
           
          </body>
        </html>
      `;
  const askPermission = () => {
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Pdf creator needs External Storage Write Permission',
            message:
              'Pdf creator needs access to Storage data in your SD Card',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          createPDF();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        alert('Write permission err', err);
        console.warn(err);
      }
    }
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    } else {
      createPDF();
    }
  }
  const createPDF = async () => {
    let options = {
      //Content to print
      html: htmlContent,
      //File Name
      fileName: 'my-test',
      //File directory
      directory: 'Download',

      base64: true
    };

    let file = await RNHTMLtoPDF.convert(options)
    // console.log(file.filePath);
    Alert.alert('Successfully Exported', 'Path:' + file.filePath, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open', onPress: () => openFile(file.filePath) }
    ], { cancelable: true });

  }

  const openFile = (filepath) => {
    const path = filepath;// absolute-path-to-my-local-file.
    FileViewer.open(path)
      .then(() => {
        // success
      })
      .catch(error => {
        // error
      });
  }
  return (
    <View style={styles.MainContainer}>
      <TouchableOpacity onPress={askPermission}>
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/pdf.png',
          }}
          style={styles.ImageStyle}
        />
        <Text style={styles.text}>Generar Orden de servicio</Text>
      </TouchableOpacity>
    </View>
  )
}

export default OST

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#123',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
  },
  ImageStyle: {
    height: 150,
    width: 150,
    resizeMode: 'center',
  },
});

const htmlStyles = `
*{
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}

h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }

/* table */

table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }

/* page */

html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
html { background: #999; cursor: default; }

body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

/* header */

header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }

header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }

/* article */

article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }

article address { float: left; font-size: 125%; font-weight: bold; }

/* table meta & balance */

table.meta, table.balance { float: right; width: 36%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

/* table meta */

table.meta th { width: 40%; }
table.meta td { width: 60%; }

/* table items */

table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }

table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: right; width: 12%; }
table.inventory td:nth-child(4) { text-align: right; width: 12%; }
table.inventory td:nth-child(5) { text-align: right; width: 12%; }

/* table balance */

table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }

/* aside */

aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`;