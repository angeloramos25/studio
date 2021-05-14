import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';

import FeedScreen from './FeedScreen';
import LeaderboardScreen from './LeaderboardScreen';

export default class AdminChallengeDetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'Leaderboard',
      challenge: null,
      user: null,
    }
  }

  async componentDidMount() {
    // auth().signOut();
    const user = auth().currentUser;
    if (!user) {
      this.props.navigation.navigate('Onboarding');
    } else {
      const user = (await firestore().collection('Clients').doc(auth().currentUser.uid).get())._data;
      const challengeDoc = await firestore().collection('Challenges').doc(user.challengeIDs[0]).get();
      const challenge = { id: challengeDoc.id, ...challengeDoc._data }
      this.setState({ user, challenge });
    }
  }

  render() {
    let screens;
    if (this.state.challenge) {
      screens = {
        'Leaderboard': <LeaderboardScreen challenge={this.state.challenge} />,
        'Feed': <FeedScreen navigation={this.props.navigation} user={this.state.user} challenge={this.state.challenge} />,
      }
    }

    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title={this.state.challenge ? this.state.challenge.name : 'Loading...'}
          leftButtonImage="back"
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <View style={{...Styling.containers.row, backgroundColor: 'white', width: '100%' }}>
            {['Leaderboard', 'Feed'].map(tabName =>
              <TouchableOpacity key={tabName} style={{ flex: 1, alignItems: 'center' }} onPress={() => this.setState({ currentTab: tabName })}>
                <Text style={Styling.text.bodyLarge}>{tabName}</Text>
                {this.state.currentTab == tabName && <View style={{ height: 2, width: '100%', backgroundColor: Styling.colors.primary}}/>}
              </TouchableOpacity>
            )}
          </View>
          {screens && screens[this.state.currentTab]}
        </SafeAreaView>
      </View>
    )
  }
}
