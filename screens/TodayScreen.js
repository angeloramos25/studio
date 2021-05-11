import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
} from 'react-native';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';

export default class TodayScreen extends React.Component {
  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <TopBar
          title="Today"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
