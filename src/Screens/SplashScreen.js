import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthViewController from '../Redux/Action/AuthViewController';
import { colors } from '../Global_CSS/TheamColors';
// import AuthViewController from '../Redux/Action/AuthViewController';

const SplashScreen = () => {
  const navigation = useNavigation();
  const {checkLoginStatus} = AuthViewController();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get token from AsyncStorage
        if (token) {
          // Validate the token or proceed to the main screen
          
          navigation.replace('DefaultScreen');
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        navigation.replace('LoginScreen'); // Fallback to login on error
      }
    };

    const timeout = setTimeout(initializeApp, 3000); // Delay for 3 seconds to show splash
    return () => clearTimeout(timeout); // Clear timeout on unmount
  }, [checkLoginStatus, navigation]);

  return (
    <View style={styles.container}>
      <View></View>
      <Text style={styles.textFlexhire}>Flexhire</Text>
      <View style={styles.textContainer}>
        <Text style={styles.textcintainer1}>Powered by</Text>
        <Image
          style={styles.swatsanlogo}
          source={require('../Assets/CompanyLogo/swatsan_logo.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textcintainer1: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#808080',
    textAlign: 'center',
  },
  textFlexhire:{
    fontsize:500,
    color:colors.secondary,
    fontWeight:'bold'
  },
  textContainer: {
    marginBottom: 36,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  swatsanlogo: {
    height: 36,
    width: 200,
    maxWidth: 200,
  },
  imagestyle: {
    justifyContent: 'center',
    height: 130,
    width: 240,
  },
});

export default SplashScreen;
