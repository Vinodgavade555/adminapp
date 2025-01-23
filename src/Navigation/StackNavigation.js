import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../Screens/UserScreens/LoginScreen.js';
import SplashScreen from '../Screens/SplashScreen.js';
import SignupScreen from '../Screens/UserScreens/SignupScreen.js';
import ForgotpasswordScreen from '../Screens/UserScreens/ForgotpasswordScreen.js';
import LogoutComponent from '../Screens/UserScreens/LogoutScreen.js';
import OtpVerificationScreen from '../Screens/UserScreens/OtpVerificationScreen.js';
import ResetPasswordScreen from '../Screens/UserScreens/ResetPasswordScreen.js.js';
import DefaultScreen from '../Screens/DefaultScreen.js';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotpasswordScreen"
        component={ForgotpasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LogoutComponent"
        component={LogoutComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OtpVerificationScreen"
        component={OtpVerificationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
