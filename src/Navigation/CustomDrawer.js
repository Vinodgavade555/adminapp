import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../Global_CSS/TheamColors';

const CustomDrawer = ({children}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const translateX = useState(new Animated.Value(-300))[0];
  const navigation = useNavigation();

  const toggleDrawer = () => {
    if (drawerVisible) {
      Animated.timing(translateX, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      setDrawerVisible(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerVisible(false));
  };

  const notification = () => {
    navigation.navigate('Notification');
  };

  const handleOutsideTap = () => {
    if (drawerVisible) {
      closeDrawer();
    }
  };

  return (
    <>
      <View style={styles.nav}>
        <IconButton
          icon="menu"
          onPress={() => toggleDrawer()}
          iconColor="#fff"
          size={36}
        />
        <IconButton
          icon="bell"
          onPress={() => notification()}
          iconColor="#fff"
          size={30}
        />
      </View>

      {drawerVisible && (
        <TouchableWithoutFeedback onPress={handleOutsideTap}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.drawer, {transform: [{translateX}]}]}>
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: colors.primary,
          }}>
          <Image
            source={require('../Assets/Images/Userimage.png')}
            style={{height: 80, width: '100%'}}
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={toggleDrawer}
            style={styles.closeIconContainer}>
            <Ionicons name="close" size={28} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.manageDirections}>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('userProfile');
                toggleDrawer();
              }}>
              <Ionicons name="person" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('bookmark');
                toggleDrawer();
              }}>
              <Ionicons name="bookmark" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Saved Jobs</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('bookmark');
                toggleDrawer();
              }}>
              <Ionicons name="briefcase" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Recommended jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons
                name="stats-chart"
                size={18}
                style={styles.iconStyles}
              />
              <Text style={styles.menuItemText}>Profile performance</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons name="eye" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Display preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons
                name="chatbubbles"
                size={18}
                style={styles.iconStyles}
              />
              <Text style={styles.menuItemText}>Chat for help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons name="settings" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons name="browsers" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Jobseeker services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons name="list" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Flexhire blog</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons
                name="help-circle"
                size={18}
                style={styles.iconStyles}
              />
              <Text style={styles.menuItemText}>How Flexhire Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('');
                toggleDrawer();
              }}>
              <Ionicons
                name="alert-circle"
                size={18}
                style={styles.iconStyles}
              />
              <Text style={styles.menuItemText}>About us</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('LogoutComponent');
                toggleDrawer();
              }}>
              <Ionicons name="log-out" size={18} style={styles.iconStyles} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.companyName}>Swatsan Tech.</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 275,
    backgroundColor: colors.primary,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999, // Below the drawer but above other content
  },
  nav: {
    backgroundColor: colors.primary,
    height: 65,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuItem: {
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 6,
    borderColor: '#f5f5f5',
  },
  menuItemText: {
    color: '#f2f2f2',
    fontSize: 14,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 26,
  },
  manageDirections: {
    flex: 1,
    flexDirection: 'column',
  },
  menuItemsContainer: {
    flex: 1,
  },
  iconStyles: {
    margin: 10,
    color: '#f2f2f2',
  },
  line: {
    height: 1, // This sets the thickness of the line
    backgroundColor: '#808080', // This sets the color of the line (black in this case)
    marginVertical: 4, // Optional: adds space above and below the line
  },
  companyName: {
    color: '#ffff',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
    marginVertical: 18,
  },
});

export default CustomDrawer;
