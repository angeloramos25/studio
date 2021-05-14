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

export default class JoinChallengeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      challengeCode: '',
      isLoading: false,
    }
    this.joinChallenge = this.joinChallenge.bind(this);
  }

  async joinChallenge() {
    let errorMessage;
    if (this.state.challengeCode === '') {
      errorMessage = 'Please enter a challenge code.';
    }

    if (errorMessage) {
      this.setState({ errorMessage });
      return;
    }

    this.setState({ isLoading: true });

    let firstName = await AsyncStorage.getItem('first_name');
    let lastName = await AsyncStorage.getItem('last_name');
    let fullName = firstName + " " + lastName;

    const querySnapshot = await firestore().collection('Challenges').where('challengeJoinCode', '==', this.state.challengeCode).get();
    if (querySnapshot.size === 0) {
      this.setState({errorMessage: 'Challenge code is invalid', isLoading: false});
      return;
    } else {
      this.setState({errorMessage: ''});
    }

    const documentSnapshot = querySnapshot.docs[0];
    let challengeID = documentSnapshot.id;
    let challengeData = documentSnapshot.data();

    await firestore().collection('Clients').doc(auth().currentUser.uid).update({
      challengeIDs: firestore.FieldValue.arrayUnion(challengeID)
    });

    let taskDates = {};
    for (let task of challengeData.tasks) {
      taskDates[task.name] = [];
    }

    userInfo = {};
    let userKey = 'UIDToInfo.' + auth().currentUser.uid;
    userInfo[userKey] = {name: fullName, taskDates: taskDates}

    await firestore().collection('Challenges').doc(challengeID).update(userInfo);

    this.props.navigation.navigate('UserChallenges', { challengeID: challengeID });

    this.setState({ isLoading: false });

  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <TopBar
          title="Join Challenge"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <View style={{ marginTop: 24 }}>
            <Text style={{...Styling.text.bodyLarge, textAlign: 'center', marginBottom: 24, marginHorizontal: 16}}>Please enter the challenge code given to you by your fitness club or studio:</Text>
            <TextInput
              style={Styling.textfields.box}
              onChangeText={text => this.setState({ challengeCode: text })}
              value={this.state.challengeCode}
              autoCapitalize='characters'
            />
          </View>
          <Button
            onPress={this.joinChallenge}
            loading={this.state.isLoading}
            text="Join Challenge"
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
