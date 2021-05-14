import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default class ChallengesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      admin: null,
      challenges: null,
    }
  }

  async componentDidMount() {
    const admin = (await firestore().collection('Admins').doc(auth().currentUser.uid).get())._data;
    const promises = [];
    for (const id of admin.challengeIDs) {
      promises.push(firestore().collection('Challenges').doc(id).get());
    }
    Promise.all(promises).then(values =>
      this.setState({ challenges: values.map(doc => doc._data )})
    );
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <TopBar
          title="Challenges"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Button
              onPress={() => this.props.navigation.navigate('ChallengeCreation')}
              text="New Challenge"
              type="cta"
              style={{ marginTop: 24 }}
            />
            {this.state.challenges && this.state.challenges.map(challenge =>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AdminChallengeDetail')} style={{...Styling.containers.card, marginTop: 24 }}>
                <Text style={Styling.text.header}>{challenge.name}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
