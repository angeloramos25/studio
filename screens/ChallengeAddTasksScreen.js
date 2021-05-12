import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default class ChallengeAddTasksScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    }
    this.createChallenge = this.createChallenge.bind(this);
  }

  render() {
    return(
      <View>
        <TopBar
          title="Add Tasks"
          leftButtonText="Back"
          leftButtonColor={Styling.colors.primary}
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <Button
            onPress={this.createChallenge}
            text="Create Challenge"
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
