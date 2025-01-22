import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomDrawer from '../Recruiter/Navigation/CustomDrawer';
import CustomBottomTab from '../Recruiter/Navigation/CustomBottomTab';

const DefaultScreen = () => {
  return (
    <View style={styles.container}>
      <CustomDrawer />
      <CustomBottomTab />
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
