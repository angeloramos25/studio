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
import Button from '../components/Button';

export default class ChallengesScreen extends React.Component {
  render() {
    return(
      <View>
        <TopBar
          title="Challenges"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <Button
            onPress={() => this.props.navigation.navigate('ChallengeCreation')}
            text="New Challenge"
            type="cta"
            style={{ marginTop: 24 }}
          />
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
