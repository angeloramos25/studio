import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';

export default class TasksScreen extends React.Component {

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1, marginTop: 24 }}>
          <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around'}}>
            {this.props.tasks.map(task =>
              <View style={{...Styling.containers.card, alignItems: 'center', justifyContent: 'space-around', width: '40%', height: 150 }}>
                <Text style={Styling.text.header}>
                  {task.name}
                </Text>
                <Text style={{ ...Styling.text.body }}>Done 1 time(s) today</Text>
                <TouchableOpacity style={styles.circleButton} onPress={() => this.props.handleTaskComplete(task.name)}>
                  <Text style={{ color: 'white', fontSize: 16 }}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circleButton: {
    backgroundColor: Styling.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
