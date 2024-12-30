import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use any icon library

const CustomHeader = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack(); // Navigate to the previous screen
    } else {
      navigation.navigate('Home'); // Fallback to a specific screen if no previous screen
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleGoBack}
        style={styles.iconContainer}
        accessible
        accessibilityLabel="Go back">
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
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
