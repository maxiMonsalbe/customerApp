import React, { Component } from 'react';
import {
  Share,
  TouchableOpacity
} from 'react-native';

import {Button, Text}  from "native-base"

const shareOptions = {
  title: 'Title',
  message: 'Caso finalizado - adjunto imagenes', // Note that according to the documentation at least one of "message" or "url" fields is required
  url: 'www.example.com',
  subject: 'Subject'
};

export default class ShareImage extends React.Component {

  onSharePress = () => Share.share(shareOptions);

  render(){
    return(

        <Button width="40%"
        bg="#0098da"
        bold mt={5} onPress={this.onSharePress} color='#5DADE2'>Enviar fotos</Button>
    
    );
  }
}