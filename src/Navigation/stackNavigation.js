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
import HomeScreen from '../Screens/BottomTabScreens/HomeScreen.js';
import CustomNotificationScreen from '../Constant/CustomNotification.js';
import JobDetailScreen from '../Components/JobDetail.js';
import ViewApplicationsScreen from '../Components/ViewApplication.js';
import JobInvitationPage from '../Components/JobInvitationPage.js';
import UserAppliesScreen from '../Screens/BottomTabScreens/UserAppliesScreen.js';
import UserDetailScreen from '../Components/UserDetailPage.js';
import AnalyticPage from '../Screens/BottomTabScreens/AnalyticPage.js';
import ShortlistCandidate from '../Screens/BottomTabScreens/ShortlistedCandidatePage.js';
import SavedUserList from '../Components/SavedUserList.js';

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
        name="Home"
        component={HomeScreen}
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

      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Notification"
        component={CustomNotificationScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ApplicationPage"
        component={ViewApplicationsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="InvitationPage"
        component={JobInvitationPage}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
      name='SaveUserPage'
      component={SavedUserList}
      options={{headerShown:false}}
      />

      <Stack.Screen
      name='ShortlistUser'
      component={ShortlistCandidate}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
