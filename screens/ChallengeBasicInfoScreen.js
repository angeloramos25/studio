import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';

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
      startDate: null,
      endDate: null,
      challengeJoinCode: '',
    }
  }

  render() {
    return(
      <View>
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
            onPress={() => this.props.navigation.navigate('ChallengeAddTasks')}
            text="Continue"
            type="cta"
            style={{ marginTop: 24 }}
          />
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
