import AsyncStorage from '@react-native-async-storage/async-storage'

//Constantes utiles
// IP en Casa
//const RUTA_API = 'http://192.168.0.4:3033'

// IP en Oficina
//const RUTA_API = 'http://192.168.190.149:3033'
//const RUTA_API = 'http://127.0.0.1:3306'

//IP Ruta mi WIFI
//const RUTA_API ='http://192.168.0.245:3033'

// IP de produccion
const RUTA_API = 'http://190.246.216.236:3033'

//IP cable de Red
//const RUTA_API = 'http://192.168.190.173:3033'

// 20215.23 => 20.215,23
const invert = (a) => {
  let res = ""
  for (let i = (a.length - 1); i >= 0; i--) {
    res += a[i]
  }
  return res
}

//Formato 2432.05 --> 2.432,05
const formatoBanco = (a) => {
  let data = Number(a).toFixed(2)
  data = data.split(".")
  let resul = ""
  let elements = ""
  let contador = 0
  for (let i = (data[0].length - 1); i >= 0; i--) {
    contador++
    if (contador == 3) {
      elements += data[0][i] + "."
      contador = 0
      continue
    }
    elements += data[0][i]
  }
  if (data[1].length > 2) {
    if (data[1][2] < 5) {
      data[1] = data[1][0] + data[1][1]
    } else {
      data[1] = data[1][0] + (String(Number(data[1][1]) + 1))
    }
  }
  resul = invert(elements) + "," + data[1]
  if (resul[0] == ".") {
    return resul.replace(".", "")
  }
  return resul
}


//cambio 1992-08-15 --> 15/08/1992
function GetFormattedDate(dayTime) {
  let data = String(dayTime)
  let separado = data.split("-")
  return separado[2] + "/" + separado[1] + "/" + separado[0]
}
const storeData = async (clave,value) => {

  try {

      await AsyncStorage.setItem(`@${clave}`, JSON.stringify(value))
  } catch (e) {

      console.log("Error al guardar en local storage" + e )

  }
}


const getData = async (clave) => {
  try {
    const value = await AsyncStorage.getItem(`@${clave}`)

    return value != null ? JSON.parse(value) : null;
  } catch(e) {

    console.log("Error al recuperar del local storage")

  }

}
const reomoveItem = async (clave) => {
  try {
    const value = await AsyncStorage.removeItem(`@${clave}`)

    return "BORRADO";
  } catch(e) {

    console.log("Error al BORRAR")

  }

}



module.exports = {
  formatoBanco,
  RUTA_API,
  GetFormattedDate,
  getData,
  storeData,
  reomoveItem
  
}