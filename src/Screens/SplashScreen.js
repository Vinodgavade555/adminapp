import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
        const checkUserData = async () => {
          try {
            const userdata = await AsyncStorage.getItem('userdata');
            if (userdata !== null) {
              navigation.navigate('DefaultScreen');
            } else {
              navigation.navigate('LoginScreen');
            }
          } catch (error) {
            console.error('Error retrieving user data', error);
            navigation.navigate('LoginScreen');
          }
        };
        setTimeout(() => {
          checkUserData();
        }, 3000);
      }, [navigation]);


  return (
    <View style={styles.container}>
      <View></View>
      <Image
        style={styles.imagestyle}
        source={require('../Assets/CompanyLogo/flexhire-logo.png')}
      />
      <View style={styles.textContainer}>
        <Text style={styles.textcintainer1}>Powered by</Text>
        <Image style={styles.swatsanlogo} source={require('../Assets/CompanyLogo/swatsan_logo.png')}/>
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
  textContainer: {
    marginBottom:36,
    justifyContent: 'center',
    flexDirection:'column',
  },
  swatsanlogo:{
    height: 36,
    width: 200,
    maxWidth:200,

  },
  imagestyle: {
    justifyContent: 'center',
    height: 130,
    width: 240,
  },
});

export default SplashScreen;
