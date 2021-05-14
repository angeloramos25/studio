import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';

export default class LikesListScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title="Likes"
          leftButtonImage="back"
          onLeftPress={() => this.props.navigation.pop()}
        />
        <SafeAreaView style={{...Styling.containers.wrapper, flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
            {this.props.route.params.likes.map(like =>
              <View
                key={like.userID}
                style={{...Styling.containers.card, marginTop: 12, ...Styling.containers.row, justifyContent: 'space-between' }}
              >
                <View>
                  <Text style={Styling.text.bodyLarge}>{like.displayName}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}
