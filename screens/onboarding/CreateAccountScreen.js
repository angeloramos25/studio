import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';

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

    this.normalCreateAccount = this.normalCreateAccount.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.appleSignIn = this.appleSignIn.bind(this);
  }

  componentDidMount() {
    GoogleSignin.configure();
  }

  normalCreateAccount() {
    email = this.state.email
    password = this.state.password

    if (email === "" || password === "") {
      this.setState({errorMessage: "Please fill out all of the fields above."});
      return;
    }

    this.setState({isLoading: true});
    auth()
    .createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(async () => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      this.setState({isLoading: false});
      if (error.code === 'auth/email-already-in-use') {
        this.setState({errorMessage: "This email is already in use."});
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        this.setState({errorMessage: "Please enter a valid email address."});
        console.log('That email address is invalid!');
      }

      if (error.code === 'auth/weak-password') {
        this.setState({errorMessage: "Please enter a stronger/longer password."});
      }

      console.error(error);
    });
  }

  async googleSignIn() {
    this.setState({googleIsLoading: true});
    try {
      this.setState({ isSigninInProgress: true });
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(idToken);
      const thing = await auth().signInWithCredential(credential);
      this.setState({ isSigninInProgress: false });
    } catch (error) {
      this.setState({googleIsLoading: false});
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  async appleSignIn() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    this.setState({appleIsLoading: true});
    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    // Sign the user in with the credential
    await auth().signInWithCredential(appleCredential);
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
            onPress={this.normalCreateAccount}
            loading={this.isLoading}
          />
          <View style={{...Styling.containers.row, marginTop: 24 }}>
            <View style={styles.line}/>
            <Text style={{...Styling.text.label, marginLeft: 6, marginRight: 6, color: Styling.colors.gray}}>Or</Text>
            <View style={styles.line}/>
          </View>
          <SignInButton
            name="Google"
            imageName="google_logo"
            backgroundColor="white"
            textColor="black"
            onPress={this.googleSignIn}
            isLoading={this.state.googleIsLoading}
          />
          <SignInButton
            name="Apple"
            imageName="apple_logo"
            backgroundColor="white"
            textColor="black"
            onPress={this.appleSignIn}
            isLoading={this.state.appleIsLoading}
          />
        </SafeAreaView>
      </View>
    )
  }
}

function SignInButton(props) {

  const {
    name,
    imageName,
    backgroundColor,
    textColor,
    onPress,
    isLoading
  } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      {!isLoading ?
      <View style={{...Styling.containers.row, backgroundColor: backgroundColor, justifyContent: 'center', marginTop: 12, height: 44, borderRadius: 10}}>
            <Image source={Images[imageName]} style={{width: 20, height: 20, resizeMode: 'contain', marginVertical: 14}} />
            <Text style={{...Styling.text.title, color: textColor, marginLeft: 12}}>Sign in with {name}</Text>
      </View>
        :
        <View style={{...Styling.containers.row, backgroundColor: backgroundColor, justifyContent: 'center', marginTop: 12, height: 44}}>

        <ActivityIndicator size="small" color="black" animating={isLoading}/>
        </View>
    }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    flex: 1,
    backgroundColor: Styling.colors.gray,
  },
});
