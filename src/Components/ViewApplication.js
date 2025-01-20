import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import JobViewController from '../Redux/Action/JobViewController';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../Global_CSS/TheamColors';

const ViewApplicationsScreen = ({route}) => {
  const {jobId} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {GetJobApplications, ApplicationJobStatus, toggleshortlistUser} =
    JobViewController();
  const {JobApplications} = useSelector(state => state.job);
  const isFocus = useIsFocused();
  const [expandedSkills, setExpandedSkills] = useState({});
  const [id, setId] = useState('');
  const [selectedTab, setSelectedTab] = useState('matching');

  const handleTabChange = tab => {
    setSelectedTab(tab);
  };

  // console.log(GetJobApplications);
  

  const handleToggleViewMore = index => {
    setExpandedSkills(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const toggleHandler = async (item, index) => {
    if (!item || !item.id) {
      console.error('Invalid item or missing id:', item);
      return;
    }

    try {
      if (item?.status == 'APPLIED') {
        let context = {
          status: 'APPLICATION VIEWED',
          message: 'Application viewed successfully',
        };
        dispatch(ApplicationJobStatus(item?.id, context, jobId));
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
    navigation.navigate('UserDetailScreen', {data: item, page: 'application'});
  };

  const HandleShortlist = item => {
    const shortlistData = {
      job_id: jobId,
      user_id: item.id,
      recruiter_id: id,
      is_shortlist_by_recruiter: true,
    };
    // console.log('job', jobId, 'usr', item.id, 'recri', id);


    dispatch(toggleshortlistUser(shortlistData));
  };

  const HandleDeny = item => {
    const shortlistData = {
      job_id: jobId,
      user_id: item.id,
      recruiter_id: id,
      is_shortlist_by_recruiter: false,
    };

    // console.log('job', jobId, 'usr', item.id, 'recri', id);

    dispatch(toggleshortlistUser(shortlistData)); // Call the action
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data');
        setId(id);
        dispatch(GetJobApplications(jobId));
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

  const calculateExperience = (joiningDate, leavingDate) => {
    const joinDate = new Date(joiningDate);
    const leaveDate = new Date(leavingDate || new Date());

    let years = leaveDate.getFullYear() - joinDate.getFullYear();
    let months = leaveDate.getMonth() - joinDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return {years, months};
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Job Applications Details</Text>

      <View style={styles.matchchipsContainer}>
        <TouchableOpacity
          style={[
            styles.matchchip,
            selectedTab === 'matching' && styles.selectedChip,
          ]}
          onPress={() => handleTabChange('matching')}>
          <Text style={styles.matchchipText}>Matching</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.matchchip,
            selectedTab === 'non-matching' && styles.selectedChip,
          ]}
          onPress={() => handleTabChange('non-matching')}>
          <Text style={styles.matchchipText}>Non-Matching</Text>
        </TouchableOpacity>
      </View>

      {(selectedTab === 'matching'
        ? JobApplications?.matching_applies
        : JobApplications?.unmatching_applies
      )?.map((item, index) => {
        const user = item?.user;
        const initialSkills = user?.key_skills?.slice(0, 4) || [];
        const allSkills = user?.key_skills || [];
        const showAllSkills = expandedSkills[index] || false;
        const status = item?.status;

        const currentJob = user?.employment_details.find(
          job => job.is_current_company === 'true',
        );
        const experienceText = currentJob
          ? `${currentJob?.role} at ${currentJob?.company_name}, ${
              calculateExperience(
                currentJob?.joining_date,
                currentJob?.leaving_date,
              ).years
            }y ${
              calculateExperience(
                currentJob?.joining_date,
                currentJob?.leaving_date,
              ).months
            }m`
          : null;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.applicationItem,
              {backgroundColor: status === 'APPLIED' ? '#cde4d8' : '#fff'},
            ]}
            onPress={() => toggleHandler(item)}>
            <View
              style={{backgroundColor: '#fafafa', padding: 8, borderRadius: 8}}>
              <View style={styles.profileContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.applicationNameText}>
                    {user?.first_name} {user?.last_name}
                  </Text>

                  {experienceText && (
                    <View style={styles.experienceContainer}>
                      <Text style={styles.applicationExperienceText}>
                        {experienceText}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.imageContainer}>
                  {user?.profile_photo ? (
                    <Image
                      source={{uri: user?.profile_photo}}
                      style={styles.profilePhoto}
                    />
                  ) : (
                    <Image
                      source={require('../Assets/Images/Userimage.png')}
                      style={styles.profilePhoto}
                    />
                  )}
                </View>
              </View>

              <View style={styles.salaryAndDateContainer}>
                {user?.career_preferences?.[0]?.current_total_exp ? (
                  <View style={styles.totalExp}>
                    <Ionicons name="briefcase" size={14} color="gray" />
                    <Text style={styles.applicationExpText}>
                      {user?.career_preferences?.[0]?.current_total_exp} years
                    </Text>
                  </View>
                ) : null}

                {user?.career_preferences?.[0]?.current_annual_salary
                  ?.amount ? (
                  <View style={styles.iconTextSalaryContainer}>
                    <Ionicons name="cash" size={14} color="gray" />
                    <Text style={styles.salaryText}>
                      {formatAmount(
                        user?.career_preferences?.[0]?.current_annual_salary
                          ?.amount,
                      )}{' '}
                      {user?.career_preferences?.[0]?.current_annual_salary
                        ?.currency || ''}
                    </Text>
                  </View>
                ) : null}

                {user?.career_preferences?.[0]?.notice_period ? (
                  <View style={styles.iconTextContainer}>
                    <Ionicons name="time" size={16} color="gray" />
                    <Text style={styles.applicationNoticeText}>
                      {user?.career_preferences?.[0]?.notice_period}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.locationContainer}>
                {user?.career_preferences?.[0]?.current_city && (
                  <View style={styles.locationItem}>
                    <Ionicons name="location" size={14} color="gray" />
                    <Text style={styles.applicationLocationText}>
                      {user?.career_preferences?.[0]?.current_city}
                    </Text>

                    {Array.isArray(
                      user?.career_preferences?.[0]?.pref_locations,
                    ) &&
                      user?.career_preferences?.[0]?.pref_locations.length >
                        0 && (
                        <Text style={styles.applicationPrefLocationText}>
                          {' ('}
                          {user?.career_preferences?.[0]?.pref_locations.join(
                            ', ',
                          )}
                          {')'}
                        </Text>
                      )}
                  </View>
                )}
              </View>
              {user?.career_preferences?.[0]?.expected_salary?.amount ? (
                <View style={styles.iconTextContainer}>
                  <Text style={styles.applicationExpectedText}>
                    Expected Salary :
                  </Text>
                  <Text style={styles.salaryText}>
                    {formatAmount(
                      user?.career_preferences?.[0]?.expected_salary?.amount,
                    )}{' '}
                    {user?.career_preferences?.[0]?.expected_salary?.currency ||
                      ''}
                  </Text>
                </View>
              ) : null}

              <ScrollView contentContainerStyle={styles.chipContainer}>
                {(showAllSkills ? allSkills : initialSkills).map(
                  (skill, skillIndex) => (
                    <View key={skillIndex} style={styles.chip}>
                      <Text style={styles.chipText}>{skill}</Text>
                    </View>
                  ),
                )}
                {user?.key_skills?.length > 4 && (
                  <TouchableOpacity onPress={() => handleToggleViewMore(index)}>
                    <View style={styles.chip}>
                      <Text style={styles.chipViewText}>
                        {showAllSkills ? 'View Less' : 'View More'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <View style={styles.leftButtons}>
                <TouchableOpacity
                  style={[styles.shortlistButton]}
                  onPress={() => {
                    HandleShortlist(item);
                  }}>
                  <Text style={styles.circleButtonText}>Shortlist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.circleButton, styles.deniedButton]}
                  onPress={() => {
                    HandleDeny(item);
                  }}>
                  <Ionicons name="close-circle-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.circleButton, styles.callButton]}
                onPress={() => console.log('Call clicked')}>
                <Ionicons name="call" size={24} color="#1aa3ff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 18,
    marginVertical: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  matchchipsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 8,
  },
  matchchip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: '#b3d7ff',
  },
  matchchipText: {
    fontSize: 12,
    color: '#004a99',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
    flexShrink: 1,
  },
  imageContainer: {
    width: 48,
    height: 48,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  applicationItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
  },
  experienceContainer: {
    // marginTop: 5,
  },
  applicationExperienceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#004466',
    flexWrap: 'wrap',
    width: '100%',
  },

  applicationNameText: {
    fontSize: 14,
    color: colors.blackText,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicationLocationText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
  applicationPrefLocationText: {
    fontSize: 12,
    color: '#000',
  },
  applicationText: {
    fontSize: 12,
    color: 'gray',
  },
  boldText: {
    color: colors.blackText,
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 12,
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
  },
  applicationExpText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 6,
  },

  salaryAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  iconTextSalaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 6,
  },
  salaryText: {
    color: '#000',
    fontSize: 12,
    marginLeft: 4,
  },
  applicationDateText: {
    color: '#000',
    fontSize: 12,
  },
  applicationExpectedText: {
    color: '#000',
    fontSize: 12,
  },
  applicationNoticeText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between the two groups
    alignItems: 'center',
    marginTop: 8,
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Space between "Shortlist" and "Denied" buttons
  },

  shortlistButton: {
    backgroundColor: '#fff',
    borderColor: '#1aa3ff',
    borderRadius: 50,
    borderWidth: 1,
    padding: 8,
  },
  circleButton: {
    width: 40, // Adjust the size as per your design
    height: 40, // Same as width for a perfect circle
    borderRadius: 25, // Half of the width/height for a circular shape
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deniedButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#ff4d4f',
  },
  callButton: {
    backgroundColor: '#fff',
    borderColor: '#1aa3ff',
  },
  circleButtonText: {
    fontSize: 14, // Adjust font size as needed
    fontWeight: 'bold',
    color: '#1aa3ff', // Match the border color for Shortlist text
  },
});

export default ViewApplicationsScreen;
