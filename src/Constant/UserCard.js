import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import {colors} from '../Global_CSS/TheamColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import JobViewController from '../Recruiter/RecruiterRedux/Action/JobViewController';
const _width = Dimensions.get('window').width;

const UserCard = ({item, jobId, page_name, index, isHorizontal,coverLetter}) => {
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const isFocus = useIsFocused();
  useEffect(() => {
    console.log('Job Applications Updated_____________________', item);
  }, [item]);
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
  // const transformedData = transformJobSeekerProfile(item?.user_id || item);
  const transformedData =
    item && item.user_id
      ? transformJobSeekerProfile(item.user_id)
      : transformJobSeekerProfile(item);
  // const userProfile =
  //   page_name === 'job_invitation' || page_name === 'home'
  //     ? item?.job_seeker_profile
  //     : item?.user;

  const userProfile =
    item?.job_seeker_profile || item?.user_id?.job_seeker_profile;
  // const userProfile = item?.job_seeker_profile;

  console.log('******', item?.is_shortlisted);

  const [expandedSkills, setExpandedSkills] = useState({});
  const skills = userProfile?.key_skills || [];
  const initialSkills = skills.slice(0, 3);
  const allSkills = skills;
  const showAllSkills = expandedSkills[index];
  const dispatch = useDispatch();
  const {toggleshortlistUser, ToggleSaveUser} = JobViewController();
  const [isSaved, setIsSaved] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(item.is_shortlisted);
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data');
        setId(id);
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };
    setIsShortlisted(item?.is_shortlisted);

    getUserData();
  }, [isFocus]);

  const ToggleShortlist = item => {
    const shortlistData = {
      job_id: jobId,
      user_id: item.id,
      recruiter_id: id,
      is_shortlist_by_recruiter: !isShortlisted,
    };

    dispatch(toggleshortlistUser(shortlistData));
  };

  const handleSaveToggle = async () => {
    setIsSaved(!isSaved); // Toggle the save state

    const saveData = {
      user_id: item.id,
      recruiter_id: id,
      // is_saved: !isSaved,
    };
    console.log('Toggling save action:', saveData);
    dispatch(ToggleSaveUser(saveData));
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

  const currentJob = userProfile?.employment_details?.find(
    job => job.is_current_company === 'true',
  );
  const experienceText = currentJob
    ? `${currentJob?.job_title} at ${currentJob?.company_name}`
    : null;
  return (
    <TouchableOpacity
      style={[
        styles.applicationItem,
        {
          width: isHorizontal ? _width * 0.85 : _width - 24,
        },
      ]}
      onPress={() => {
        // console.log("Stringified Transformed Data:", JSON.stringify(jobId));
        navigation.navigate('RecruiterStack', {
          screen: 'UserDetailScreen',
          params: {
            data: {user: transformedData, jobId: jobId, cover_letter: coverLetter},
            page: page_name,
          },
        });

        // navigation.navigate('UserDetailScreen', {
        //   data: {user: transformedData, jobId: jobId},
        //   page: page_name,
        // });
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
              {item?.first_name || item?.user_id?.first_name}{' '}
              {item?.last_name || item?.user_id?.last_name}
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
                source={{uri: item?.profile_photo}}
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
          {userProfile?.career_preferences?.[0]?.total_exp ? (
            <View style={styles.totalExp}>
              <Ionicons name="briefcase" size={14} color="gray" />
              <Text style={styles.applicationExpText}>
                {userProfile?.career_preferences?.[0]?.total_exp} years
              </Text>
            </View>
          ) : null}

          {userProfile?.career_preferences?.[0]?.annual_salary?.amount ? (
            <View style={styles.iconTextSalaryContainer}>
              <Ionicons name="cash" size={14} color="gray" />
              <Text style={styles.salaryText}>
                {userProfile?.career_preferences?.[0]?.annual_salary
                  ?.currency || ''}{' '}
                {formatAmount(
                  userProfile?.career_preferences?.[0]?.annual_salary?.amount,
                )}
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
          {userProfile?.career_preferences?.[0]?.city && (
            <View style={styles.locationItem}>
              <Ionicons name="location" size={14} color="#004466" />
              <Text style={styles.applicationLocationText}>
                {userProfile?.career_preferences?.[0]?.city}
              </Text>

              {Array.isArray(
                userProfile?.career_preferences?.[0]?.pref_locations,
              ) &&
                userProfile?.career_preferences?.[0]?.pref_locations.length >
                  0 && (
                  <Text style={styles.applicationPrefLocationText}>
                    {' ('}
                    {page_name === 'home'
                      ? userProfile?.career_preferences?.[0]?.pref_locations
                          .slice(0, 2)
                          .join(', ') +
                        (userProfile?.career_preferences?.[0]?.pref_locations
                          .length > 2
                          ? ' ...'
                          : '')
                      : userProfile?.career_preferences?.[0]?.pref_locations.join(
                          ', ',
                        )}{' '}
                    {')'}
                  </Text>
                )}
            </View>
          )}
        </View>

        {userProfile?.career_preferences?.[0]?.expected_salary?.amount ? (
          <View style={styles.iconTextContainer}>
            <Text style={styles.applicationExpectedText}>
              Expected Salary :{item?.is_shortlist_by_recruiter}
            </Text>
            <Text style={styles.salaryText}>
              {userProfile?.career_preferences?.[0]?.expected_salary
                ?.currency === 'INR'
                ? `₹ ${formatAmount(
                    userProfile?.career_preferences?.[0]?.expected_salary
                      ?.amount,
                  )}`
                : `${
                    userProfile?.career_preferences?.[0]?.expected_salary
                      ?.currency
                  } ${formatAmount(
                    userProfile?.career_preferences?.[0]?.expected_salary
                      ?.amount,
                  )}`}
            </Text>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.chipContainer}>
          {(page_name === 'home'
            ? allSkills.slice(0, 3)
            : showAllSkills
            ? allSkills
            : initialSkills
          ).map((skill, skillIndex) => (
            <View key={skillIndex} style={styles.chip}>
              <Text style={styles.chipText}>{skill}</Text>
            </View>
          ))}

          {page_name != 'home' && userProfile?.key_skills?.length > 3 && (
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
      {/* {console.log('item.isSaved', item?.user_id?.is_saved)} */}
      <View style={styles.buttonContainer}>
        {page_name === 'home' ? (
          <TouchableOpacity
            style={[styles.saveButton]}
            onPress={handleSaveToggle}>
            <Ionicons
              name={
                item.isSaved || item?.user_id?.is_saved
                  ? 'bookmark'
                  : 'bookmark-outline'
              }
              size={24}
              color={
                item.isSaved || item?.user_id?.is_saved ? '#1aa3ff' : '#808080'
              }
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftButtons}>
            <TouchableOpacity
              // style={[styles.shortlistButton]}
              onPress={() => {
                ToggleShortlist(userProfile);
              }}>
              <Ionicons
                name={
                  item?.user_id?.is_shortlisted || item?.is_shortlisted
                    ? 'heart'
                    : 'heart-outline'
                }
                size={24}
                color="red"
              />
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
          onPress={() => Linking.openURL(`tel:${userProfile.mobile_number}`)}>
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
    gap: 12, // Space between "Shortlist" and "Denied" buttons
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
