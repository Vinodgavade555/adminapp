import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../BottomTabScreens/HomeScreen.js';
import CustomNotificationScreen from '../../Constant/CustomNotification.js';
import UserDetailScreen from '../Components/UserDetailPage.js';
import ShortlistCandidate from '../BottomTabScreens/ShortlistedCandidatePage.js';
import SavedUserList from '../Components/SavedUserList.js';
import ApplicationsListScreen from '../Components/ApplicationList.js';
import InvitationList from '../Components/InvitationList.js';
import JobDetailScreen from '../Components/JobDetail.js';
import {colors} from '../../Global_CSS/TheamColors.js';

const RecruiterNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
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
        component={ApplicationsListScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="InvitationPage"
        component={InvitationList}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SaveUserPage"
        component={SavedUserList}
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          title: 'Saved Users',
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="ShortlistUser"
        component={ShortlistCandidate}
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          title: 'Shortlisted Users',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default RecruiterNavigation;
