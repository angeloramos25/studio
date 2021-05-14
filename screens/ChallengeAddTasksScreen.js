import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default class ChallengeAddTasksScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [{
        name: '',
        pointValue: '',
        description: '',
      }],
      errorMessage: '',
      isLoading: false,
    }
    this.createChallenge = this.createChallenge.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  async createChallenge() {
    const studioName = await AsyncStorage.getItem('studio_name');
    const challengeName = this.props.route.params.challengeName;
    const challengeDescription = this.props.route.params.description;
    const challengeJoinCode = this.props.route.params.challengeJoinCode;

    let errorMessage;
    for (let task of this.state.tasks) {
      if (task.name === '') {
        errorMessage = 'Please enter a name for every task.'
      } else if (task.pointValue === '') {
        errorMessage = 'Pleae enter a point value for every task.'
      }
    }

    if (errorMessage) {
      this.setState({ errorMessage });
      return;
    } else {
      this.setState({errorMessage: '', isLoading: true});
    }

    const challengeID = (await firestore().collection('Challenges').add({
      name: challengeName,
      description: challengeDescription,
      challengeJoinCode: challengeJoinCode,
      studioName: studioName,
      tasks: this.state.tasks,
    })).id;

    await firestore().collection('Admins').doc(auth().currentUser.uid).update({
      challengeIDs: firestore.FieldValue.arrayUnion(challengeID)
    });

    this.props.navigation.navigate('AdminChallengesOverview', { shouldRefresh: true });
  }

  deleteTask() {
    let tasks = this.state.tasks;
    tasks.pop();
    this.setState(tasks);
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title="Add Tasks"
          leftButtonImage="back"
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <SafeAreaView style={{...Styling.containers.wrapper, flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          <Text style={{...Styling.text.body, marginTop: 24}}>
            Tasks are items that your clients can complete daily to earn points during your challenge. Examples: Exercise for 45 min, Drink 8 cups of water, Sleep for 8 hours, etc.
          </Text>
          {this.state.tasks.map((task, taskIndex) =>
            <View style={{...Styling.containers.card, marginTop: 24 }}>
              <View style={{ marginTop: 12 }}>
                <Text style={Styling.text.label}>Task Name</Text>
                <TextInput
                  style={Styling.textfields.outline}
                  onChangeText={text => {
                    const tasks = this.state.tasks;
                    tasks[taskIndex].name = text;
                    this.setState({ tasks });
                  }}
                  value={this.state.tasks[taskIndex].name}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <Text style={Styling.text.label}>Point Value</Text>
                <TextInput
                  style={{...Styling.textfields.outline, width: 100 }}
                  keyboardType="numeric"
                  onChangeText={text => {
                    const tasks = this.state.tasks;
                    tasks[taskIndex].pointValue = text;
                    this.setState({ tasks });
                  }}
                  value={this.state.tasks[taskIndex].pointValue}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <Text style={Styling.text.label}>Description</Text>
                <TextInput
                  style={{...Styling.textfields.outline, height: 100 }}
                  multiline={true}
                  onChangeText={text => {
                    const tasks = this.state.tasks;
                    tasks[taskIndex].description = text;
                    this.setState({ tasks });
                  }}
                  value={this.state.tasks[taskIndex].description}
                />
              </View>
              { taskIndex !== 0 && taskIndex === this.state.tasks.length - 1 &&
              <TouchableOpacity style={styles.deleteButton} onPress={this.deleteTask}>
                <Text style={{color: 'white', fontSize: 20}}>-</Text>
              </TouchableOpacity>
              }
            </View>
          )}
          <Button
            onPress={() => {
              const tasks = this.state.tasks;
              tasks.push({
                name: '',
                pointValue: '',
                description: '',
              });
              this.setState({ tasks });
            }}
            text="+ Add Task"
            type="outline"
            style={{ marginTop: 24 }}
          />
          <Button
            onPress={this.createChallenge}
            text="Create Challenge"
            type="cta"
            style={{ marginTop: 24 }}
            loading={this.state.isLoading}
          />
          {this.state.errorMessage !== '' &&
            <Text style={{...Styling.text.body, color: 'red', textAlign: 'center', marginTop: 12 }}>{this.state.errorMessage}</Text>
          }
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: -10,
  }
});
