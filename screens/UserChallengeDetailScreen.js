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
    this.handleUndoTask = this.handleUndoTask.bind(this);
  }

  async componentDidMount() {
    // auth().signOut();
    const user = auth().currentUser;
    if (!user ) {
      this.props.navigation.navigate('Onboarding');
    } else {
      const user = (await firestore().collection('Clients').doc(auth().currentUser.uid).get())._data;
      if (user.challengeIDs.length === 0) {
        this.props.navigation.navigate('Onboarding');
        return;
      }
      const challengeDoc = await firestore().collection('Challenges').doc(user.challengeIDs[0]).get();
      const challenge = { id: challengeDoc.id, ...challengeDoc._data }
      this.setState({ user, challenge });
    }
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      if (this.props.route.params) {
        if (this.props.route.params.shouldRefresh) {
          this.setState({ shouldRefresh: true });
        } else {
          const user = (await firestore().collection('Clients').doc(auth().currentUser.uid).get())._data;
          const challengeDoc = await firestore().collection('Challenges').doc(user.challengeIDs[0]).get();
          const challenge = { id: challengeDoc.id, ...challengeDoc._data }
          this.setState({ user, challenge });
        }
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async handleTaskComplete(taskName) {
    const uid = auth().currentUser.uid;
    const fieldName = 'UIDToInfo.' + uid + '.taskDates.' + taskName;
    firestore().collection('Challenges').doc(this.state.challenge.id).update({
      [fieldName]: firestore.FieldValue.arrayUnion(new Date()),
    });
    const challenge = this.state.challenge;
    challenge.UIDToInfo[uid].taskDates[taskName].push({seconds: (new Date).getTime()/1000});
    this.setState({ challenge });
  }

  async handleUndoTask(taskName) {
    const uid = auth().currentUser.uid;
    const challenge = this.state.challenge;
    challenge.UIDToInfo[uid].taskDates[taskName].pop();

    const fieldName = 'UIDToInfo.' + uid + '.taskDates.' + taskName;
    firestore().collection('Challenges').doc('v1KPYXY3tBPV27X6pMcm').update({
      [fieldName]: challenge.UIDToInfo[uid].taskDates[taskName],
    });
    this.setState({ challenge });
  }

  render() {
    let screens;
    if (this.state.challenge) {
      screens = {
        'Tasks': <TasksScreen handleTaskComplete={this.handleTaskComplete} handleUndoTask={this.handleUndoTask} tasks={this.state.challenge.tasks} taskDates={this.state.challenge.UIDToInfo[auth().currentUser.uid].taskDates} />,
        'Feed': <FeedScreen onFeedLoad={() => this.setState({ shouldRefresh: false })} shouldRefresh={this.state.shouldRefresh} navigation={this.props.navigation} user={this.state.user} challenge={this.state.challenge} />,
        'Leaderboard': <LeaderboardScreen challenge={this.state.challenge} />
      }
    }

    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title={this.state.challenge ? this.state.challenge.name : 'Loading...'}
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
