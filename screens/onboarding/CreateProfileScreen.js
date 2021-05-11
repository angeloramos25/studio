import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

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
      errorMessage: '',
      isLoading: false,
    }
    this.createProfile = this.createProfile.bind(this);
  }

  async createProfile() {

    let errorMessage;
    if (this.state.firstName === '') {
      errorMessage = 'Please enter your first name.';
    } else if (this.state.lastName === '') {
      errorMessage = 'Please enter your last name.';
    }

    if (errorMessage) {
      this.setState({ errorMessage });
      return;
    }

    this.setState({ isLoading: true });

    const email = this.props.route.params && this.props.route.params.email ? this.props.route.params.email : JSON.parse(await AsyncStorage.getItem('email'));

    await firestore().collection('Users').doc(auth().currentUser.uid).set({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: email,
      uid: auth().currentUser.uid,
    });
    this.setState({ isLoading: false });
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
