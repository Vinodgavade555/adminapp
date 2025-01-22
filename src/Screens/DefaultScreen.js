import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {UserContext} from '../Services/UserContext';
import RecruiterDrawer from '../Recruiter/Navigation/RecruiterDrawer';
import RecruiterBottomTab from '../Recruiter/Navigation/RecruiterBottomTab';
import TLDrawer from '../Team_Lead/Navigation/TLDrawer';
import TLBottomTab from '../Team_Lead/Navigation/TLBottomTab';

const DefaultScreen = () => {
  const {userType} = useContext(UserContext);
  console.log('User Type:', userType);
  return (
    <View style={styles.container}>
      {/* <CustomDrawer />
      <CustomBottomTab /> */}
      {userType === 'Recruiter' && <RecruiterDrawer />}
      {userType === 'Recruiter' && <RecruiterBottomTab />}
      {userType === 'TA Manager' && <TLDrawer />}
      {userType === 'TA Manager' && <TLBottomTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take full height of the screen
    backgroundColor: '#ffffff', // Set background color to light gray
  },
});

export default DefaultScreen;
