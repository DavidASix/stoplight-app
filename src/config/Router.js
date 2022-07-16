import React from 'react';
import {
  View,
  BackHandler,
} from 'react-native';

import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack';

import Home from '../screens/Home/';
import Settings from '../screens/Settings/';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        presentation: 'transparentModal',
        ...TransitionPresets.ModalPresentationIOS  }}
      initialRouteName="home" >
      <Stack.Screen
        name="home"
        component={Home}
        options={({ navigation, route }) => ({ title: 'home' })} />
      <Stack.Screen
        name="settings"
        component={Settings}
        options={({ navigation, route }) => ({ title: 'settings' })} />
    </Stack.Navigator>
  );
}

const Router = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

export default Router;
