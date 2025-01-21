import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {colors} from '../Global_CSS/TheamColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import JobViewController from '../Redux/Action/JobViewController';
const _width = Dimensions.get('window').width;

const UserCard = ({item, jobId, page_name, index, isHorizontal}) => {
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const isFocus = useIsFocused();
  const transformJobSeekerProfile = userData => {
    const {job_seeker_profile, ...rest} = userData;

    if (!job_seeker_profile) {
      return rest;
    }

    return {
      ...rest,
      ...job_seeker_profile,
    };
  };
  const transformedData = transformJobSeekerProfile(item);

  const userProfile =
    page_name === 'job_invitation' || page_name === 'home'
      ? item?.job_seeker_profile
      : item?.user;

  const [expandedSkills, setExpandedSkills] = useState({});
  const skills = userProfile?.key_skills || [];
  const initialSkills = skills.slice(0, 3);
  const allSkills = skills;
  const showAllSkills = expandedSkills[index];
  const dispatch = useDispatch();
  const {toggleshortlistUser} = JobViewController();
  const [isSaved, setIsSaved] = useState(false);

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

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data');
        setId(id);
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, [isFocus]);

  const HandleShortlist = item => {
    const shortlistData = {
      job_id: jobId,
      user_id: item.id,
      recruiter_id: id,
      is_shortlist_by_recruiter: true,
    };

    console.log('job', jobId, 'usr', item.id, 'recri', id);

    dispatch(toggleshortlistUser(shortlistData));
  };

  const handleSaveToggle = async () => {
    setIsSaved(!isSaved); // Toggle the save state

    const saveData = {
      user_id: item.id,
      recruiter_id: id,
      is_saved: !isSaved,
    };
    console.log('Toggling save action:', saveData);
    dispatch(ToggleSaveJob(saveData));
  };

  const HandleDeny = item => {
    const shortlistData = {
      job_id: jobId,
      user_id: item.id,
      recruiter_id: id,
      is_shortlist_by_recruiter: false,
    };

    dispatch(toggleshortlistUser(shortlistData));
  };

  const handleToggleViewMore = index => {
    setExpandedSkills(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const formatAmount = value => {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(1) + ' Cr';
    } else if (value >= 100000) {
      return (value / 100000).toFixed(1) + ' Lac';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + ' K';
    } else {
      return value?.toString() || 'N/A';
    }
  };

  console.log('userProfile', JSON.stringify(userProfile, null, 2));

  const currentJob = userProfile?.employment_details?.find(
    job => job.is_current_company === 'true',
  );
  const experienceText = currentJob
    ? `${currentJob?.role} at ${currentJob?.company_name}, ${
        calculateExperience(currentJob?.joining_date, currentJob?.leaving_date)
          .years
      }y ${
        calculateExperience(currentJob?.joining_date, currentJob?.leaving_date)
          .months
      }m`
    : null;

  return (
    <TouchableOpacity
      style={[
        styles.applicationItem,
        {
          width: isHorizontal ? _width * 0.8 : _width - 24, // If horizontal scroll, set width to 70% of screen
        },
      ]}
      onPress={() => {
        navigation.navigate('UserDetailScreen', {
          data: {user: transformedData, jobId: jobId},
          page: page_name,
        });
      }}>
      <View
        style={{
          backgroundColor: '#fafafa',
          padding: 8,
          borderRadius: 8,
        }}>
        <View style={styles.profileContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.applicationNameText}>
              {item?.first_name} {item?.last_name}
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
            {item?.profile_photo ? (
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
          {userProfile?.career_preferences?.[0]?.current_total_exp ? (
            <View style={styles.totalExp}>
              <Ionicons name="briefcase" size={14} color="gray" />
              <Text style={styles.applicationExpText}>
                {userProfile?.career_preferences?.[0]?.current_total_exp} years
              </Text>
            </View>
          ) : null}

          {userProfile?.career_preferences?.[0]?.current_annual_salary
            ?.amount ? (
            <View style={styles.iconTextSalaryContainer}>
              <Ionicons name="cash" size={14} color="gray" />
              <Text style={styles.salaryText}>
                {formatAmount(
                  userProfile?.career_preferences?.[0]?.current_annual_salary
                    ?.amount,
                )}{' '}
                {userProfile?.career_preferences?.[0]?.current_annual_salary
                  ?.currency || ''}
              </Text>
            </View>
          ) : null}

          {userProfile?.career_preferences?.[0]?.notice_period ? (
            <View style={styles.iconTextContainer}>
              <Ionicons name="time" size={14} color="gray" />
              <Text style={styles.applicationNoticeText}>
                {userProfile?.career_preferences?.[0]?.notice_period}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.locationContainer}>
          {userProfile?.career_preferences?.[0]?.current_city && (
            <View style={styles.locationItem}>
              <Ionicons name="location" size={14} color="#004466" />
              <Text style={styles.applicationLocationText}>
                {userProfile?.career_preferences?.[0]?.current_city}
              </Text>

              {Array.isArray(
                userProfile?.career_preferences?.[0]?.pref_locations,
              ) &&
                userProfile?.career_preferences?.[0]?.pref_locations.length >
                  0 && (
                  <Text style={styles.applicationPrefLocationText}>
                    {' ('}
                    {userProfile?.career_preferences?.[0]?.pref_locations.join(
                      ', ',
                    )}
                    {')'}
                  </Text>
                )}
            </View>
          )}
        </View>

        {userProfile?.career_preferences?.[0]?.expected_salary?.amount ? (
          <View style={styles.iconTextContainer}>
            <Text style={styles.applicationExpectedText}>
              Expected Salary :
            </Text>
            <Text style={styles.salaryText}>
              {formatAmount(
                userProfile?.career_preferences?.[0]?.expected_salary?.amount,
              )}{' '}
              {userProfile?.career_preferences?.[0]?.expected_salary
                ?.currency || ''}
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
          {userProfile?.key_skills?.length > 4 && (
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
        {page_name != 'job_invitation' ? (
          <TouchableOpacity
            style={[styles.saveButton]}
            onPress={handleSaveToggle}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? '#1aa3ff' : '#808080'}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftButtons}>
            <TouchableOpacity
              style={[styles.shortlistButton]}
              onPress={() => {
                HandleShortlist(userProfile);
              }}>
              <Text style={styles.circleButtonText}>Shortlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleButton, styles.deniedButton]}
              onPress={() => HandleDeny(userProfile)}>
              <Ionicons name="close-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.circleButton, styles.callButton]}
          onPress={() => console.log('Call clicked')}>
          <Ionicons name="call" size={24} color="#1aa3ff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
    marginRight: 12,
    // minHeight: 280,
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
export default UserCard;
