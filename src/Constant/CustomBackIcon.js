import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use any icon library

const CustomHeader = () => {
  // const navigation = useNavigation();

 
  return (
    <View style={[styles.container,styles.iconContainer]}>
      
        <Icon name="arrow-back" size={24} color="black" />
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    backgroundColor: '#f1f1f1',
    padding: 8,

    borderRadius: 30, // Makes the container circular
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Border width
    borderColor: 'black',
  },
});

export default CustomHeader;
