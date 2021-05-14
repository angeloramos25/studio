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
import AdminChallengeDetailScreen from './screens/AdminChallengeDetailScreen';
import ChallengeBasicInfoScreen from './screens/ChallengeBasicInfoScreen';
import ChallengeAddTasksScreen from './screens/ChallengeAddTasksScreen';

// User challenges
import UserChallengesScreen from './screens/UserChallengesScreen';
import UserChallengeDetailScreen from './screens/UserChallengeDetailScreen';
import AddPostScreen from './screens/AddPostScreen';

// Shared screens
import LikesListScreen from './screens/LikesListScreen';
import ChallengeInfoScreen from './screens/ChallengeInfoScreen';

const OnboardingStack = createStackNavigator();
function OnboardingStackScreen() {
  return(
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FAFAFA' },
        gestureEnabled: false,
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
        gestureEnabled: false,
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
        gestureEnabled: false,
      }}
    >
      <UserChallengeStack.Screen name="UserChallengeDetail" component={AdminChallengeDetailScreen} />
      <UserChallengeStack.Screen name="LikesList" component={LikesListScreen} />
    </UserChallengeStack.Navigator>
  )
}

const AdminChallengeStack = createStackNavigator();
function AdminChallengeStackScreen() {
  return(
    <AdminChallengeStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FAFAFA' },
        gestureEnabled: false,
      }}
    >
      <AdminChallengeStack.Screen name="AdminChallengesOverview" component={ChallengesScreen} />
      <AdminChallengeStack.Screen name="AdminChallengeDetail" component={AdminChallengeDetailScreen} />
      <AdminChallengeStack.Screen name="LikesList" component={LikesListScreen} />
    </AdminChallengeStack.Navigator>
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
          initialRouteName={this.state.isAdmin ? 'AdminChallenges' : 'UserChallenges'}
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
          mode="modal"
        >
          <Stack.Screen name="UserChallenges" component={UserChallengeDetailScreen} />
          <Stack.Screen name="AdminChallenges" component={AdminChallengeStackScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingStackScreen} />
          <Stack.Screen name="ChallengeCreation" component={ChallengeCreationStackScreen} />
          <Stack.Screen name="AddPost" component={AddPostScreen} />
          <Stack.Screen name="ChallengeInfo" component={ChallengeInfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
