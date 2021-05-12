import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import Styling from '../constants/Styling';
import Images from '../assets/Images.js';

export default function TopBar(props) {

  console.log(props);

  return (
    <View style={styles.container}>
      {props.leftButtonText || props.leftButtonImage ?
        <TouchableOpacity onPress={props.onLeftPress} style={styles.leftItem}>
          {props.leftButtonText ?
            <Text style={{...Styling.text.body, color: props.leftButtonColor }}>{props.leftButtonText}</Text>
            :
            <Image style={{ width: 25, height: 25 }} source={Images[props.leftButtonImage]} />
          }
        </TouchableOpacity>
        : null
      }
      <Text style={styles.title}>{props.title}</Text>
      {props.rightButtonText || props.rightButtonImage ?
        <TouchableOpacity onPress={props.onRightPress} style={styles.rightItem}>
          {props.rightButtonText ?
            <Text style={{...Styling.text.body, color: props.rightButtonColor }}>{props.rightButtonText}</Text>
            :
            <Image style={{ width: 25, height: 25 }} source={Images[props.rightButtonImage]} />
          }
        </TouchableOpacity>
        : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    ...Styling.text.header,
    alignSelf: 'center',
  },
  leftItem: {
    position: 'absolute',
    left: 12,
    bottom: 12,
  },
  rightItem: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  }
});
