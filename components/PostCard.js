import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import Styling from '../constants/Styling';
import Images from '../assets/Images.js';
import {
  getPrettyDateString,
  daysAgo,
} from '../utils';

export default function PostCard(props) {
  return (
    <View style={{...Styling.containers.card, marginTop: 12 }}>
      <View style={{...Styling.containers.row, justifyContent: 'space-between' }}>
        <Text style={Styling.text.header}>{props.title}</Text>
        <Text style={Styling.text.body}>{daysAgo(props.timestamp)}</Text>
      </View>
      <Text style={{...Styling.text.body, marginTop: 4 }}>{props.description}</Text>
      {props.imageUrl && <Image source={{ uri: props.imageUrl }} style={{ width: '100%', height: undefined, aspectRatio: 1, marginTop: 12, borderRadius: 10 }} />}
    </View>
  );
}
