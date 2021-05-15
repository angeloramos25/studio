import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';

export default class ChallengeInfoScreen extends React.Component {

  render() {

    const challenge = this.props.route.params.challenge;

    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title="Challenge Info"
          rightButtonText="Done"
          rightButtonColor={Styling.colors.primary}
          onRightPress={() => this.props.navigation.pop()}
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Challenge Name</Text>
            <View style={Styling.containers.card}>
              <Text style={Styling.text.bodyLarge}>{challenge.name}</Text>
            </View>
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Description</Text>
            <View style={Styling.containers.card}>
              <Text style={Styling.text.bodyLarge}>{challenge.description}</Text>
            </View>
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Challenge Join Code</Text>
            <View style={Styling.containers.card}>
              <Text style={Styling.text.bodyLarge}>{challenge.challengeJoinCode}</Text>
            </View>
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Tasks</Text>
            {challenge.tasks.map(task =>
              <View key={task.name} style={{...Styling.containers.card, marginTop: 12 }}>
                <Text style={Styling.text.header}>{task.name}</Text>
                <Text style={{...Styling.text.bodyLarge, marginTop: 12 }}>{task.pointValue + ' points'}</Text>
                <Text style={{...Styling.text.body, marginTop: 12 }}>{task.description}</Text>
              </View>
            )}
          </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}
