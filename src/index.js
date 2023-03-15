/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


 import 'react-native-gesture-handler';
 import React from 'react';

 import {
   View
 } from 'react-native';


 import {Box , Center , NativeBaseProvider} from "native-base";
 import { NativeRouter, Route, Switch, Link } from "react-router-native";
 import { createNativeStackNavigator } from '@react-navigation/native-stack'
 import { NavigationContainer } from '@react-navigation/native';

 
import Casos from './Casos';
import Login from './Login';
import InformeCaso from './InformeCaso';
import TomarCaso from './TomarCaso';
import DetalleService from './DetalleService';
import TomarPresencial from './TomarPresencial';
import Encuesta from './Encuesta';
import SplashScreens from './SplashScreens';
import DerivarCaso from './DerivarCaso';
import OST from './OST';
import Firma from './Firma';
import DetalleServicePresencial from './DetalleServicePresencial';
import CasosCerrados from './CasosCerrados';
import DetalleCasoCerrado from './DetalleCasoCerrado';

 const Stack = createNativeStackNavigator();

 const App = () => {
   return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator>
          <Stack.Screen name="SplashScreens" component={SplashScreens} options={{ headerShown:false}}/> 
          <Stack.Screen name="Login" component={Login} options={{ headerShown:false}}/>
          <Stack.Screen name="Casos" component={Casos}options={{ headerShown:false}}/>
          <Stack.Screen name="InformeCaso" component={InformeCaso}options={{ headerShown:false}}/>
          <Stack.Screen name="TomarCaso" component={TomarCaso} options={{ headerShown:false}}/>
          <Stack.Screen name="DetalleService" component={DetalleService} options={{ headerShown:false}}/>
          <Stack.Screen name="TomarPresencial" component={TomarPresencial} options={{ headerShown:false}}/>  
          <Stack.Screen name="Encuesta" component={Encuesta} options={{ headerShown:false}}/> 
          <Stack.Screen name="DerivarCaso" component={DerivarCaso} options={{ headerShown:false}}/> 
          <Stack.Screen name="DetalleServicePresencial" component={DetalleServicePresencial} options={{ headerShown:false}}/> 
          <Stack.Screen name="Firma" component={Firma} options={{ headerShown:false}}/> 
          <Stack.Screen name="OST" component={OST} options={{ headerShown:false}}/> 
          <Stack.Screen name="CasosCerrados" component={CasosCerrados} options={{ headerShown:false}}/> 
          <Stack.Screen name="DetalleCasoCerrado" component={DetalleCasoCerrado} options={{ headerShown:false}}/> 
          
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
    
   );
 };
 
 
 export default App;
 