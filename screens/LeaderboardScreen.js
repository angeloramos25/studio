import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';

export default class LeaderboardScreen extends React.Component {

  render() {
    console.log(this.props.challenge.tasks);
    tasks = this.props.challenge.tasks;
    uidPoints = []

    Object.keys(this.props.challenge.UIDToInfo).map(uid => {
      let points = 0;
      for (let task of this.props.challenge.tasks) {
        let name = task.name;
        let pointValue = task.pointValue;
        let dates = this.props.challenge.UIDToInfo[uid].taskDates[name];
        points += (pointValue * dates.length);
      }
      uidPoints.push([uid, points]);
    });

    uidPoints.sort(function compareFn(first, second) {
      return first[1] < second[1];
    })

    let currUID = auth().currentUser.uid;

    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <ScrollView>
          <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around', marginTop: 24}}>
            <View style={{...Styling.containers.row, alignItems: 'center', justifyContent: 'space-around', width: '100%'}}>
              <Text style={{ ...Styling.text.subheader }}>Rank</Text>
              <Text style={Styling.text.subheader}>Name</Text>
              <Text style={{ ...Styling.text.subheader }}>Points</Text>
            </View>
            {uidPoints.map((tuple, index) =>
              <View style={{...Styling.containers.horizontalCard, alignItems: 'center', justifyContent: 'space-around', borderColor: 'black', borderWidth: currUID === tuple[0] ? 1 : 0}}>
                <Text style={{ ...Styling.text.body }}>{index+1}</Text>
                <Text style={Styling.text.subheader}>
                  {this.props.challenge.UIDToInfo[tuple[0]].name}
                </Text>
                <Text style={{ ...Styling.text.body }}>{tuple[1]}</Text>
              </View>
            )}
          </View>
        </ScrollView>
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
