import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default class UserChallengesScreen extends React.Component {

  render() {
    return(
      <View>
        <TopBar
          title="Challenges"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
