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

export default class CreateAccountScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA' }}>
        <TopBar
          title="Create Account"
        />
        <SafeAreaView style={Styling.containers.wrapper}>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Email</Text>
            <TextInput
              style={Styling.textfields.box}
              placeholder="yourname@abc.com"
              placeholderTextColor="lightgray"
              onChangeText={text => this.setState({ email: text })}
              value={this.state.email}
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={Styling.text.label}>Password</Text>
            <TextInput
              style={Styling.textfields.box}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="lightgray"
              onChangeText={text => this.setState({ password: text })}
              value={this.state.password}
            />
          </View>
          <Button
            text="Create Account"
            type="cta"
            style={{ marginTop: 24 }}
          />
          <View style={{...Styling.containers.row, marginTop: 24 }}>
            <View style={styles.line}/>
            <Text style={{...Styling.text.label, marginLeft: 6, marginRight: 6, color: Styling.colors.gray}}>Or</Text>
            <View style={styles.line}/>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    flex: 1,
    backgroundColor: Styling.colors.gray,
  },
});
