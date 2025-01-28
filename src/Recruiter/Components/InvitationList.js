import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../Global_CSS/TheamColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Checkbox} from 'react-native-paper';
import UserCard from '../../Constant/UserCard';
import JobViewController from '../RecruiterRedux/Action/JobViewController';

const InvitationList = ({route}) => {
  const {jobId} = route.params;
  const dispatch = useDispatch();
  const {GetJobInvitation} = JobViewController();
  const {JobInvitations} = useSelector(state => state.job);
  const isFocus = useIsFocused();
  const navigation = useNavigation();

  const [expandedSkills, setExpandedSkills] = useState({});

  const handleToggleViewMore = index => {
    setExpandedSkills(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  console.log(JobInvitations?.results);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const recruiter_id = await AsyncStorage.getItem('user_data');
        dispatch(GetJobInvitation(jobId, recruiter_id));
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };
    getUserData();
  }, [isFocus]);
  function formatAmount(value) {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(1) + ' Cr';
    } else if (value >= 100000) {
      return (value / 100000).toFixed(1) + ' Lac';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + ' K';
    } else {
      return value?.toString() || 'N/A';
    }
  }
  if (!JobInvitations?.results?.length) {
    return (
      <View style={styles.container}>
        <Text>No Job Invitations available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Job Invitation Details</Text>

      {JobInvitations?.results?.map((jobInvitation, index) => {
        const skills = jobInvitation?.job_seeker_profile?.key_skills || [];
        const initialSkills = skills.slice(0, 3); // Show only the first 3 skills initially
        const allSkills = skills; // All skills
        const showAllSkills = expandedSkills[index]; // Check if the skills are expanded

        return (
          // <UserCard
          //   key={index}
          //   item={jobInvitation}
          //   jobId={jobId}
          //   page_name={'job_invitation'}
          //   index={index}
          // />
          <UserCard
          key={jobInvitation?.id}  // Use a unique identifier for the key
          item={jobInvitation}
          jobId={jobId}
          page_name={'job_invitation'}
          index={index}  // or user?.id if it’s more appropriate
        />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 18,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 11,
    marginBottom: 4,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationNameText: {
    fontSize: 14,
    color: colors.blackText,
    fontWeight: 'bold',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicationLocationText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 4,
  },
  applicationText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 2,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
    marginTop: 2,
  },
  chipText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'normal',
  },
  chipViewText: {
    fontSize: 11,
    color: '#0066CC',
  },
  totalExp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  applicationExpText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 6,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicationExpectedText: {
    color: '#000',
    fontSize: 12,
  },
  salaryText: {
    color: 'gray',
    fontSize: 12,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgaryText,
    marginTop: 4,
  },
  applicationNoticeText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default InvitationList;
