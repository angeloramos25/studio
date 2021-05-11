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

export default class CommunityScreen extends React.Component {
  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <TopBar
          title="Community"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
