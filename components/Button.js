import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Styling from '../constants/Styling';

export default function Button(props) {

  const textColors = {
    'cta': 'white',
    'outline': Styling.colors.primary,
  };

  return (
    <TouchableOpacity onPress={props.onPress} style={{...styles[props.type], ...props.style}}>
      {props.loading ?
        <ActivityIndicator size="small" color="white" animating={props.loading}/>
        :
        <Text style={{...Styling.text.subheader, color: textColors[props.type] }}>{props.text}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cta: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Styling.colors.primary,
    borderRadius: 10,
  },
  outline: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Styling.colors.primary,
    borderWidth: 2,
    borderRadius: 10,
  }
});
