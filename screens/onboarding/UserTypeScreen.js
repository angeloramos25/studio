import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';

import Images from '../../assets/Images.js';
import Styling from '../../constants/Styling';
import TopBar from '../../components/TopBar';
import Button from '../../components/Button';

export default class UserTypeScreen extends React.Component {

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <SafeAreaView style={Styling.containers.wrapper}>
          <Text style={{...Styling.text.bodyLarge, textAlign: 'center' }}>Are you a client or admin?</Text>
          <Button
            onPress={() => this.props.navigation.navigate('CreateAccount', { userType: 'client' })}
            text="Client"
            type="cta"
            style={{ marginTop: 48 }}
          />
          <Button
            onPress={() => this.props.navigation.navigate('CreateAccount', { userType: 'admin' })}
            text="Admin"
            type="outline"
            style={{ marginTop: 12 }}
          />
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
