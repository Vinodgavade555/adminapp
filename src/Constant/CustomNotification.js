import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../Global_CSS/TheamColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'; // Import moment.js

// Example data with date added
const notifications = [
  {
    id: 1,
    title: 'Job Alert',
    description: 'We found a job matching your profile.',
    type: 'job_alert',
    date: moment(), // Current date for the job alert
  },
  {
    id: 2,
    title: 'Interview Invite',
    description: 'You have been invited for an interview.',
    type: 'interview_invite',
    date: moment().subtract(1, 'days'), // 1 day ago
  },
  {
    id: 3,
    title: 'Profile Update Reminder ',
    description:
      'Update your profile to increase your chances.Update your profile to increase your chances',
    type: 'profile_update_reminder',
    date: moment().subtract(2, 'days'), // 2 days ago
  },
];

const CustomNotificationScreen = () => {
  const [readNotifications, setReadNotifications] = useState([]); // Array to store clicked (read) notification IDs
  const navigation = useNavigation();

  // Handle notification click
  const handleNotificationClick = notification => {
    const {id, type} = notification;

    // Only add the notification to 'readNotifications' if it's not already there
    if (!readNotifications.includes(id)) {
      setReadNotifications(prevState => [...prevState, id]);
    }

    // Handle navigation based on the notification type
    switch (type) {
      case 'job_alert':
        navigation.navigate('JobDetail');
        break;
      case 'interview_invite':
        navigation.navigate('ApplicationStatus');
        break;
      case 'profile_update_reminder':
        navigation.navigate('userProfileScreen');
        break;
      default:
        console.log('Unknown notification type');
    }
  };

  // Helper function to render icon based on notification type
  const renderIcon = type => {
    switch (type) {
      case 'job_alert':
        return (
          <Ionicons
            name="briefcase"
            size={20}
            color="#007bff"
            style={styles.icon}
          />
        );
      case 'interview_invite':
        return <Ionicons name="person-outline" size={20} style={styles.icon} />;
      case 'profile_update_reminder':
        return (
          <Ionicons
            name="person"
            size={20}
            color="#f39c12"
            style={styles.icon}
          />
        );
      default:
        return (
          <Ionicons
            name="notifications-outline"
            size={20}
            color="#333"
            style={styles.icon}
          />
        );
    }
  };

  const renderDate = date => {
    if (moment(date).isSame(moment(), 'day')) {
      return 'Today';
    } else {
      return moment(date).fromNow(); // Relative time (e.g., "2 days ago")
    }
  };

  return (
    <></>
    // <View style={styles.mainContainer}>
    //   <View style={styles.header}>
    //     <CustomHeader />
    //   </View>
    //   <Text style={styles.textInfo}>Stay up to date</Text>

    //   <FlatList
    //     data={notifications}
    //     renderItem={({ item }) => {
    //       const isRead = readNotifications.includes(item.id);
    //       return (
    //         <TouchableOpacity
    //           onPress={() => handleNotificationClick(item)}
    //           style={[
    //             styles.notificationItem,
    //             { backgroundColor: isRead ? '#fff': '#e3f0e9' },
    //           ]}
    //         >
    //           <View style={styles.notificationContent}>
    //             {/* Display Icon */}
    //             {renderIcon(item.type)}

    //             {/* Notification Text */}
    //             <View style={styles.textContainer}>
    //               <Text style={styles.description}>{item.description}</Text>
    //               <Text style={styles.notificationTitle}>{item.title}</Text>
    //             </View>

    //             <Text style={styles.timeAgo}>{renderDate(item.date)}</Text>
    //           </View>
    //         </TouchableOpacity>
    //       );
    //     }}
    //     keyExtractor={item => item.id.toString()}
    //   />
    // </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 12,
  },
  header: {
    marginBottom: 12,
    marginLeft: 12,
  },
  textInfo: {
    color: colors.blackText,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  notificationItem: {
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 12,
  },
  notificationTitle: {
    // fontWeight: 'bold',
    fontSize: 12,
    color: 'gray',
    paddingTop: 4,
  },
  description: {
    fontSize: 14,
    color: colors.blackText,
  },
  notificationContent: {
    flexDirection: 'row', // Align items in a row (icon + text + date)
    alignItems: 'flex-start', // Align items to start (icon + text)
    justifyContent: 'space-between', // Space between icon, text, and date
  },
  textContainer: {
    flex: 1, // Ensure the text takes up the available space
    marginLeft: 4,
  },

  timeAgo: {
    fontSize: 11,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  icon: {
    marginRight: 12,
  },
});

export default CustomNotificationScreen;
