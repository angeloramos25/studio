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

import TasksScreen from './TasksScreen';
import FeedScreen from './FeedScreen';
import LeaderboardScreen from './LeaderboardScreen';

export default class UserChallengeDetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'Tasks',
      challenge: null,
      user: null,
    }
    this.handleTaskComplete = this.handleTaskComplete.bind(this);
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

  async handleTaskComplete(taskName) {
    const uid = 'HONQrly1LYRKuWhXz8URugMyDdB2';
    const fieldName = 'UIDToInfo.' + uid + '.taskDates.' + taskName;
    const challenge = (await firestore().collection('Challenges').doc('v1KPYXY3tBPV27X6pMcm').update({
      [fieldName]: firestore.FieldValue.arrayUnion(new Date()),
    }));
    this.setState({ challenge });
  }

  render() {

    let screens;
    if (this.state.challenge) {
      screens = {
        'Tasks': <TasksScreen handleTaskComplete={this.handleTaskComplete} tasks={this.state.challenge.tasks} />,
        'Feed': <FeedScreen navigation={this.props.navigation} user={this.state.user} challenge={this.state.challenge} />,
        'Leaderboard': <LeaderboardScreen challenge={this.state.challenge} />
      }
    }

    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title="Challenge Name"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <View style={{...Styling.containers.row, backgroundColor: 'white', width: '100%' }}>
            {['Tasks', 'Feed', 'Leaderboard'].map(tabName =>
              <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.setState({ currentTab: tabName })}>
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

const styles = StyleSheet.create({

});
