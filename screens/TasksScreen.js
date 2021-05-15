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

  constructor(props) {
    super(props);
    this.alreadyCompleted = this.alreadyCompleted.bind(this);
    this.isInSameDay = this.isInSameDay.bind(this);
  }

  alreadyCompleted(task) {
    let dates = this.props.taskDates[task.name];
    let today = new Date();
    for (let date of dates) {
      if (this.isInSameDay(new Date(date.seconds * 1000), today)) {
        return true;
      }
    }
    return false;
  }

  isInSameDay(first, second) {
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
          <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around'}}>
            {this.props.tasks.map(task =>
              <View key={task.name} style={{...Styling.containers.card, marginTop: 24, alignItems: 'center', justifyContent: 'space-around', width: '40%', height: 150, backgroundColor: this.alreadyCompleted(task) ? Styling.colors.primary : 'white' }}>
                <Text style={{...Styling.text.bodyLarge, textAlign: 'center', color: this.alreadyCompleted(task) ? 'white' : Styling.colors.primary }}>
                  {task.name}
                </Text>
                { !this.alreadyCompleted(task) ?
                <TouchableOpacity style={styles.circleButton} onPress={() => this.props.handleTaskComplete(task.name)}>
                  <Text style={{ color: 'white', fontSize: 16 }}>+</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={{height: 40, justifyContent: 'center'}} onPress={() => this.props.handleUndoTask(task.name)}>
                  <Text style={{...Styling.text.label, color: 'red', fontSize: 16 }}>Undo</Text>
                </TouchableOpacity>
                }
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
