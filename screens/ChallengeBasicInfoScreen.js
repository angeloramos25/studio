import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default class ChallengeBasicInfoScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      challengeName: '',
      description: '',
      challengeJoinCode: '',
      errorMessage: '',
      isLoading: false,
    }
    this.continuePress = this.continuePress.bind(this);
  }

  async continuePress() {
    let errorMessage;
    if (this.state.challengeName === '') {
      errorMessage = 'Please enter a challenge name.';
    } else if (this.state.description === '') {
      errorMessage = 'Please enter a description.';
    } else if (this.state.challengeJoinCode === '') {
      errorMessage = 'Please enter a challenge join code.';
    }

    if (errorMessage) {
      this.setState({ errorMessage });
      return;
    } else {
      this.setState({errorMessage: ''});
    }

    this.setState({ isLoading: true });

    await firestore().collection('Challenges').where('challengeJoinCode', '==', this.state.challengeJoinCode).get().then(querySnapshot => {
      if (querySnapshot.size !== 0) {
        errorMessage = 'Challenge code is already in use.';
      }
    });

    if (errorMessage) {
      this.setState({isLoading: false, errorMessage });
      return;
    } else {
      this.setState({errorMessage: ''});
    }

    this.props.navigation.navigate('ChallengeAddTasks', this.state)
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <TopBar
          title="Basic Info"
          leftButtonText="Cancel"
          leftButtonColor="red"
          onLeftPress={() => this.props.navigation.pop()}
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Challenge Name</Text>
            <TextInput
              style={Styling.textfields.box}
              onChangeText={text => this.setState({ challengeName: text })}
              value={this.state.challengeName}
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Description</Text>
            <TextInput
              style={{...Styling.textfields.box, height: 100 }}
              multiline={true}
              onChangeText={text => this.setState({ description: text })}
              value={this.state.description}
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Challenge Join Code</Text>
            <TextInput
              style={Styling.textfields.box}
              onChangeText={text => this.setState({ challengeJoinCode: text })}
              value={this.state.challengeJoinCode}
            />
          </View>
          <Button
            onPress={this.continuePress}
            text="Continue"
            type="cta"
            style={{ marginTop: 24 }}
            loading={this.state.isLoading}
          />
          {this.state.errorMessage !== '' &&
            <Text style={{...Styling.text.body, color: 'red', textAlign: 'center', marginTop: 12 }}>{this.state.errorMessage}</Text>
          }
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
