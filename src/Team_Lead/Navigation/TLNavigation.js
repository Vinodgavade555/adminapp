import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../../Screens/UserScreens/LoginScreen.js';
import SplashScreen from '../../Screens/SplashScreen.js';
import SignupScreen from '../../Screens/UserScreens/SignupScreen.js';
import ForgotpasswordScreen from '../../Screens/UserScreens/ForgotpasswordScreen.js';
import LogoutComponent from '../../Screens/UserScreens/LogoutScreen.js';
import OtpVerificationScreen from '../../Screens/UserScreens/OtpVerificationScreen.js';
import ResetPasswordScreen from '../../Screens/UserScreens/ResetPasswordScreen.js.js';
import DefaultScreen from '../../Screens/DefaultScreen.js';
import Trial from '../trial.js';

const TLNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Trial}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default TLNavigation;
