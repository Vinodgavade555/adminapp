import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';

const LogoutComponent = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const handlelLogOut = async () => {
      try {
        console.log('Fetching user data from AsyncStorage');
        await AsyncStorage.removeItem('userdata');
        console.log('User data removed from AsyncStorage');

        navigation.navigate('LoginScreen');
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    handlelLogOut();
  }, [navigation]);
  return <></>;
};
export default LogoutComponent;
