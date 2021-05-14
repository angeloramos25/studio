import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as Font from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Main tabs
import TodayScreen from './screens/TodayScreen';
import CommunityScreen from './screens/CommunityScreen';

//Onboarding
import UserTypeScreen from './screens/onboarding/UserTypeScreen';
import CreateAccountScreen from './screens/onboarding/CreateAccountScreen';
import CreateProfileScreen from './screens/onboarding/CreateProfileScreen';
import JoinChallengeScreen from './screens/onboarding/JoinChallengeScreen';

//Admin challenges stack
import ChallengesScreen from './screens/ChallengesScreen';
import ChallengeBasicInfoScreen from './screens/ChallengeBasicInfoScreen';
import ChallengeAddTasksScreen from './screens/ChallengeAddTasksScreen';

// User challenges
import UserChallengesScreen from './screens/UserChallengesScreen';
import UserChallengeDetailScreen from './screens/UserChallengeDetailScreen';
import AddPostScreen from './screens/AddPostScreen';

const OnboardingStack = createStackNavigator();
function OnboardingStackScreen() {
  return(
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FAFAFA' },
      }}
    >
      <OnboardingStack.Screen name="UserType" component={UserTypeScreen} />
      <OnboardingStack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <OnboardingStack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <OnboardingStack.Screen name="JoinChallenge" component={JoinChallengeScreen} />
    </OnboardingStack.Navigator>
  )
}

const ChallengeCreationStack = createStackNavigator();
function ChallengeCreationStackScreen() {
  return(
    <ChallengeCreationStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FAFAFA' },
      }}
    >
      <ChallengeCreationStack.Screen name="ChallengeBasicInfo" component={ChallengeBasicInfoScreen} />
      <ChallengeCreationStack.Screen name="ChallengeAddTasks" component={ChallengeAddTasksScreen} />
    </ChallengeCreationStack.Navigator>
  )
}

const UserChallengeStack = createStackNavigator();
function UserChallengeStackScreen() {
  return(
    <UserChallengeStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FAFAFA' },
      }}
    >
      <UserChallengeStack.Screen name="UserChallenges" component={UserChallengesScreen} />
      <UserChallengeStack.Screen name="UserChallengeDetailScreen" component={UserChallengeDetailScreen} />
    </UserChallengeStack.Navigator>
  )
}

const Stack = createStackNavigator();
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'jost-light': require('./assets/fonts/Jost-Regular.ttf'),
      'jost-medium': require('./assets/fonts/Jost-Medium.ttf'),
    });
    let isAdmin = await AsyncStorage.getItem('is_admin');
    if (isAdmin) {
      isAdmin = JSON.parse(isAdmin);
    }
    this.setState({ fontLoaded: true, isAdmin });
  }

  render() {

    if (!this.state.fontLoaded) {
      return (<View></View>)
    }

    return(
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          initialRouteName={this.state.isAdmin ? 'AdminChallenges' : 'UserChallengeDetail'}
          screenOptions={{
            headerShown: false,
          }}
          mode="modal"
        >
          <Stack.Screen name="UserChallengeDetail" component={UserChallengeDetailScreen} />
          <Stack.Screen name="AdminChallenges" component={ChallengesScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingStackScreen} />
          <Stack.Screen name="ChallengeCreation" component={ChallengeCreationStackScreen} />
          <Stack.Screen name="AddPost" component={AddPostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
