import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import CustomHeader from '../../Constant/CustomBackIcon';
import GlobalStyle from '../../Global_CSS/GlobalStyle';
import {colors} from '../../Global_CSS/TheamColors';
import {IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import JobViewController from '../RecruiterRedux/Action/JobViewController';
import { IMAGE_BASE_URL } from '../../Services/baseAPI';


const JobDetailScreen = ({route, navigation}) => {
  const {jobId} = route.params; // Get company data from params
  const [id, setId] = useState();

  const dispatch = useDispatch();
  const {GetJobDetails, ToggleJobStatus} = JobViewController();
  const {JobDetails} = useSelector(state => state.job);

  const isFocus = useIsFocused();

  // console.log(JobDetails.is_active);

  const toggleHandler = async () => {
    try {
      // Toggle the current status
      let status = JobDetails.is_active ? false : true;
      let context = {
        is_active: status,
      };
      await dispatch(ToggleJobStatus(JobDetails.id, context, id));
    } catch (error) {
      console.error('Error updating job status:', error);
      // setIsActive(isActive);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data');
        dispatch(GetJobDetails(jobId, id));
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

  return (
    <View style={styles.container}>
      <View style={GlobalStyle.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CustomHeader />
        </TouchableOpacity>

        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: JobDetails.is_active ? 'red ' : 'green'},
            ]}
            onPress={toggleHandler}>
            <Text style={styles.buttonText}>
              {JobDetails.is_active ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.companyInfoContainer}>
          <View style={styles.companyInfo}>
            <View style={styles.logoContainer}>
              {/* {console.log( JobDetails?.company?.logo)
              } */}
              <Image
                source={
                  JobDetails?.company?.logo
                    ? {uri: IMAGE_BASE_URL + JobDetails?.company?.logo}
                    : require('../../Assets/CompanyLogo/Swatsan1.jpeg')
                }
                style={styles.logo}
              />
            </View>
            <Text style={styles.jobTitle}>{JobDetails?.job_title?.title}</Text>
            <Text style={styles.companyName}>
              {JobDetails?.company?.company_name}
            </Text>
            <View style={styles.locationContainer}>
              <IconButton
                icon="map-marker"
                iconColor={colors.primary}
                size={18}
                style={{padding: 0, marginLeft: 0, height: 20}}
              />
              <Text style={styles.jobCardLocation}>
                {Array.isArray(JobDetails?.job_location) &&
                JobDetails?.job_location.length > 0
                  ? JobDetails?.job_location.join(', ')
                  : 'Location not available'}
              </Text>
            </View>

            <View style={styles.mainfildContainer}>
              {[
                {
                  icon: 'cash',
                  label: 'Salary Range',
                  value:
                    JobDetails?.salary?.yearly?.min &&
                    JobDetails?.salary?.yearly?.max
                      ? `${formatAmount(
                          JobDetails?.salary?.yearly?.min,
                        )} - ${formatAmount(JobDetails?.salary?.yearly?.max)} ${
                          JobDetails?.salary?.yearly?.currency
                        }`
                      : 'Salary information not available',
                },
                {
                  icon: 'signal-cellular-3',
                  label: 'Level',
                  value: `${JobDetails?.experience_level?.minYear || 'N/A'} - ${
                    JobDetails?.experience_level?.maxYear || 'N/A'
                  } Years`,
                },
                {
                  icon: 'account',
                  label: 'Openings',
                  value:
                    JobDetails?.openings != null
                      ? JobDetails?.openings
                      : 'Openings information not available',
                },
              ].map((item, index) => (
                <View key={index} style={styles.fildContainer}>
                  <IconButton
                    icon={item.icon}
                    iconColor={colors.primary}
                    size={24}
                    style={styles.iconstyle}
                  />
                  <View style={styles.fildinerContainer}>
                    <Text style={styles.jobDetails1}>{item.label}</Text>
                    <Text style={styles.jobDetails}>{item.value}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.ButtonfildContainer}>
                <TouchableOpacity
                  style={[styles.cardButton, {backgroundColor: '#00BCD4'}]} // Unique background color for this button
                  onPress={() => {
                    navigation.navigate('ApplicationPage', { jobId: JobDetails?.id });
                    console.log(JobDetails?.id );
                    
                  }}>
                  <Text style={styles.cardbuttonInviteText}>
                    View Applications ({JobDetails?.applicant_count || 0})
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.ButtonfildContainer}>
                <TouchableOpacity
                  style={[styles.cardButton, {backgroundColor: '#FF7043'}]} // Green background for "Invite"
                  onPress={() => {
                    navigation.navigate('InvitationPage', { jobId: JobDetails?.id });
                  }}>
                  <Text style={styles.cardbuttonInviteText}>Invite</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.ButtonfildContainer}>
                <TouchableOpacity
                  style={[styles.cardButton, {backgroundColor: '#FFC107'}]}
                  onPress={() => {
                    navigation.navigate('ShortlistUser', { jobId: JobDetails?.id });
                  }}>
                  <Text style={styles.cardbuttonText}>
                    Shortlisted Candidate
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.ButtonfildContainer}>
                <TouchableOpacity
                  style={[styles.cardButton, {backgroundColor: '#dd99ff'}]}
                  onPress={() => {
                    navigation.navigate('SaveUserPage', { jobId: JobDetails?.id });
                  }}>
                  
                  <Text style={styles.cardbuttonText}>
                    Saved User List
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#deede5',
                paddingHorizontal: 18,
                paddingVertical: 24,
              }}>
              <View style={styles.jobDetailsContainer}>
                {JobDetails?.job_description?.requirements?.length > 0 && (
                  <>
                    <Text style={styles.jobDescriptionheader}>
                      Requirements:
                    </Text>
                    {JobDetails?.job_description?.requirements?.map(
                      (item, index) => (
                        <View key={index} style={styles.bulletContainer}>
                          <Text style={styles.bullet}>●</Text>
                          <Text style={styles.jobDescription}>{item}</Text>
                        </View>
                      ),
                    )}
                  </>
                )}
              </View>

              {JobDetails?.job_description?.responsibilities?.length > 0 && (
                <View style={styles.jobDetailsContainer}>
                  <Text style={styles.jobDescriptionheader}>
                    Responsibilities:
                  </Text>
                  {JobDetails?.job_description?.responsibilities?.map(
                    (item, index) => (
                      <View key={index} style={styles.bulletContainer}>
                        <Text style={styles.bullet}>●</Text>
                        <Text style={styles.jobDescription}>{item}</Text>
                      </View>
                    ),
                  )}
                </View>
              )}

              {JobDetails?.department?.length > 0 && (
                <View style={styles.jobDepartmentContainer}>
                  <Text style={styles.jobDetailsheader}>Department:</Text>
                  <Text style={styles.jobDetails1}>
                    {JobDetails?.department?.[0] || 'N/A'}
                  </Text>
                </View>
              )}

              {JobDetails?.employment_types?.length > 0 && (
                <View style={styles.jobDepartmentContainer}>
                  <Text style={styles.jobDetailsheader}>Employment types:</Text>
                  <Text style={styles.jobDetails1}>
                    {JobDetails?.employment_types?.join(', ') || 'N/A'}
                  </Text>
                </View>
              )}

              {JobDetails?.education && JobDetails?.education.length > 0 && (
                <View style={styles.jobDepartmentContainer}>
                  <Text style={styles.jobDetailsheader}>Education:</Text>
                  <View style={styles.educationItemsContainer}>
                    {JobDetails?.education.map((item, index) => (
                      <Text key={index} style={styles.jobDetails1}>
                        {item.course_name}
                        {item.specialization ? ` (${item.specialization})` : ''}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {JobDetails?.work_modes && JobDetails?.work_modes.length > 0 && (
                <View style={styles.jobDepartmentContainer}>
                  <Text style={styles.jobDetailsheader}>Working Modes:</Text>
                  <Text style={styles.jobDetails1}>
                    {JobDetails?.work_modes?.join(', ') || 'N/A'}
                  </Text>
                </View>
              )}

              {JobDetails?.industry_type?.industry_name && (
                <View style={styles.jobDepartmentContainer}>
                  <Text style={styles.jobDetailsheader}>Industry Type:</Text>
                  <Text style={styles.jobDetails1}>
                    {JobDetails?.industry_type?.industry_name || 'N/A'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  headerRightContainer: {
    flexDirection: 'row',
    gap: 18,
  },
  scrollView: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000',
  },
  companyName: {
    fontSize: 14,
    color: '#000',
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  jobCardLocation: {
    fontSize: 12,
    color: 'gray',
  },
  location: {
    fontSize: 12,
    color: '#000',
  },
  mainfildContainer: {
    marginHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjusts space between items
    marginBottom: 4,
  },
  fildContainer: {
    width: '48%', // Ensures two items per row, adjustable for spacing
    marginBottom: 10, // Space between rows
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgcolor,
    borderRadius: 8,
    elevation: 2,
  },
  ButtonfildContainer: {
    width: '48%', // Ensures two items per row, adjustable for spacing
    marginBottom: 10, // Space between rows
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  fildinerContainer: {
    flex: 1,
    marginLeft: 4, // Space between the icon and text
  },
  jobDescription: {
    fontSize: 12,
    color: '#000',
    textAlign: 'justify',
  },
  companyInfoContainer: {
    marginTop: 70,
    backgroundColor: colors.cardBgcolor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  companyInfo: {
    top: -40,
  },
  jobDetails: {
    fontSize: 12,
    marginBottom: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  jobDetails1: {
    fontSize: 14,
    color: '#000',
    alignItems: 'center',
  },

  iconstyle: {
    backgroundColor: colors.background,
  },
  logoContainer: {
    borderWidth: 0.5,
    borderColor: colors.lightgaryText,
    backgroundColor: colors.cardBgcolor,
    borderRadius: 100, // Ensures circular shape
    // top: -60,
    width: 80,
    height: 80,
    overflow: 'hidden', // Ensures the image does not exceed the container bounds
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    resizeMode: 'contain', // Adjusts the image to cover the container uniformly

  },

  jobDetailsContainer: {
    marginBottom: 8,

    marginTop: 4,
  },
  jobDescriptionheader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.blackText,
  },
  jobDepartmentContainer: {
    marginBottom: 8,
    gap: 2,
  },
  bulletContainer: {
    flexDirection: 'row',

    margin: 2,
  },
  bullet: {
    fontSize: 12,
    color: '#333',
    marginRight: 10,
  },
  jobDetailsheader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#808080',
    marginTop: 8,
  },
  educationItemsContainer: {
    flexWrap: 'wrap',
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardButton: {
    flexDirection: 'row', // Ensures text is aligned properly in the container
    backgroundColor: '#007bff', // Default background color, will be overridden per button
    borderRadius: 8, // Rounded corners
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  cardbuttonText: {
    color: '#fff', // White text color to contrast with the background
    fontSize: 12,
    fontWeight: 'bold',
   
  },
  cardbuttonInviteText: {
    color: '#fff', // White text color to contrast with the background
    fontSize: 14,
    fontWeight: 'bold',
  },
});
export default JobDetailScreen;
