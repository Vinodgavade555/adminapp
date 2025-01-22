import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {UserContext} from '../Services/UserContext';
import RecruiterNavigation from '../Recruiter/Navigation/RecruiterNavigation';
import TLNavigation from '../Team_Lead/Navigation/TLNavigation';
import StackNavigation from './StackNavigation'; // Common navigation

const MainStack = createStackNavigator();

const AuthApp = () => {
  const {userType} = useContext(UserContext);

  return (
    <MainStack.Navigator>
      {/* Always render StackNavigation */}
      <MainStack.Screen
        name="CommonStack"
        component={StackNavigation}
        options={{headerShown: false}}
      />

      {/* Conditional navigators based on userType */}
      {userType === 'Recruiter' && (
        <MainStack.Screen
          name="RecruiterStack"
          component={RecruiterNavigation}
          options={{headerShown: false}}
        />
      )}

      {userType === 'TA Manager' && (
        <MainStack.Screen
          name="TLStack"
          component={TLNavigation}
          options={{headerShown: false}}
        />
      )}
    </MainStack.Navigator>
  );
};

export default AuthApp;
