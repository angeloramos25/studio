import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as Font from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';

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
    </OnboardingStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();
function TabScreen() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          borderTopColor: 'transparent',
        },
        backgroundColor: 'white',
        showLabel: false,
        activeTintColor: 'black',
        inactiveTintColor: 'lightgray',
      }}
    >
      <Tab.Screen name="Onboarding" component={OnboardingStackScreen} />
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
    </Tab.Navigator>
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
    this.setState({ fontLoaded: true });
  }

  render() {

    if (!this.state.fontLoaded) {
      return (<View></View>)
    }

    return(
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          mode="modal"
        >
          <Stack.Screen name="Tabs" component={TabScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
