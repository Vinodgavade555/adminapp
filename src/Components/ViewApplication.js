import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  
} from 'react-native';


const ViewApplicationsScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Applications</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  applicationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  applicationText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewApplicationsScreen;
