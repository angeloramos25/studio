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
import AsyncStorage from '@react-native-async-storage/async-storage';

import Images from '../../assets/Images.js';
import Styling from '../../constants/Styling';
import TopBar from '../../components/TopBar';
import Button from '../../components/Button';

export default class CreateAccountScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      studioName: '',
      errorMessage: '',
      isLoading: false,
    }
    this.createProfile = this.createProfile.bind(this);
  }

  async createProfile() {
    let isClient = this.props.route.params.userType === 'client';

    let errorMessage;
    if (this.state.firstName === '') {
      errorMessage = 'Please enter your first name.';
    } else if (this.state.lastName === '') {
      errorMessage = 'Please enter your last name.';
    } else if (!isClient && this.state.studioName === '') {
      errorMessage = 'Please enter your studio name.';
    }

    if (errorMessage) {
      this.setState({ errorMessage });
      return;
    }

    this.setState({ isLoading: true });

    const email = this.props.route.params.email;
    AsyncStorage.setItem('first_name', this.state.firstName);
    AsyncStorage.setItem('last_name', this.state.lastName);
    AsyncStorage.setItem('email', email);

    if (isClient) {
      await firestore().collection('Clients').doc(auth().currentUser.uid).set({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: email,
        uid: auth().currentUser.uid,
        challengeIDs: []
      });
    } else {
      await firestore().collection('Admins').doc(auth().currentUser.uid).set({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        studioName: this.state.studioName,
        email: email,
        uid: auth().currentUser.uid,
        challengeIDs: []
      });

      await firestore().collection('Additional').doc('Studio').set({
        studioNames: firestore.FieldValue.arrayUnion(this.state.studioName)
      });

      AsyncStorage.setItem('studio_name', this.state.studioName);
    }

    this.setState({ isLoading: false });

    if (isClient) {
      this.props.navigation.navigate('JoinChallenge');
    }
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <TopBar
          title="Create Profile"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>First Name</Text>
            <TextInput
              style={Styling.textfields.box}
              onChangeText={text => this.setState({ firstName: text })}
              value={this.state.firstName}
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Last Name</Text>
            <TextInput
              style={Styling.textfields.box}
              onChangeText={text => this.setState({ lastName: text })}
              value={this.state.lastName}
            />
          </View>
          { this.props.route.params.userType === 'admin' &&
            <View style={{ marginTop: 24 }}>
              <Text style={Styling.text.label}>Studio Name</Text>
              <TextInput
                style={Styling.textfields.box}
                onChangeText={text => this.setState({ studioName: text })}
                value={this.state.studioName}
              />
            </View>
          }
          <Button
            onPress={this.createProfile}
            loading={this.state.isLoading}
            text="Create Profile"
            type="cta"
            style={{ marginTop: 24 }}
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
