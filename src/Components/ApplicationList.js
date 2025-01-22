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
import UserCard from '../Constant/UserCard';

const ApplicationsListScreen = ({route}) => {
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

  return (
    // <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    //   <Text style={styles.title}>Job Applications Details</Text>

    //   <View style={styles.matchchipsContainer}>
    //     <TouchableOpacity
    //       style={[
    //         styles.matchchip,
    //         selectedTab === 'matching' && styles.selectedChip,
    //       ]}
    //       onPress={() => handleTabChange('matching')}>
    //       <Text style={styles.matchchipText}>Matching</Text>
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={[
    //         styles.matchchip,
    //         selectedTab === 'non-matching' && styles.selectedChip,
    //       ]}
    //       onPress={() => handleTabChange('non-matching')}>
    //       <Text style={styles.matchchipText}>Non-Matching</Text>
    //     </TouchableOpacity>
    //   </View>

    //   {(selectedTab === 'matching'
    //     ? JobApplications?.matching_applies
    //     : JobApplications?.unmatching_applies
    //   )?.map((item, index) => {
    //     const user = item?.user_id?.job_seeker_profile;
    //     const initialSkills = user?.key_skills?.slice(0, 4) || [];
    //     const allSkills = user?.key_skills || [];
    //     const showAllSkills = expandedSkills[index] || false;
    //     const status = item?.status;

    //     const currentJob = user?.employment_details.find(
    //       job => job.is_current_company === 'true',
    //     );
    //     const experienceText = currentJob
    //       ? `${currentJob?.role} at ${currentJob?.company_name}, ${
    //           calculateExperience(
    //             currentJob?.joining_date,
    //             currentJob?.leaving_date,
    //           ).years
    //         }y ${
    //           calculateExperience(
    //             currentJob?.joining_date,
    //             currentJob?.leaving_date,
    //           ).months
    //         }m`
    //       : null;

    //     return (
    //       <TouchableOpacity
    //         key={index}
    //         style={[
    //           styles.applicationItem,
    //           {backgroundColor: status === 'APPLIED' ? '#cde4d8' : '#fff'},
    //         ]}
    //         onPress={() => toggleHandler(item)}>
    //         <View
    //           style={{backgroundColor: '#fafafa', padding: 8, borderRadius: 8}}>
    //           <View style={styles.profileContainer}>
    //             <View style={styles.textContainer}>
    //               <Text style={styles.applicationNameText}>
    //                 {item?.user_id?.first_name} {item?.user_id?.last_name}
    //               </Text>

    //               {experienceText && (
    //                 <View style={styles.experienceContainer}>
    //                   <Text style={styles.applicationExperienceText}>
    //                     {experienceText}
    //                   </Text>
    //                 </View>
    //               )}
    //             </View>
    //             <View style={styles.imageContainer}>
    //               {user?.profile_photo ? (
    //                 <Image
    //                   source={{uri: item?.user_id?.profile_photo}}
    //                   style={styles.profilePhoto}
    //                 />
    //               ) : (
    //                 <Image
    //                   source={require('../Assets/Images/Userimage.png')}
    //                   style={styles.profilePhoto}
    //                 />
    //               )}
    //             </View>
    //           </View>

    //           <View style={styles.salaryAndDateContainer}>
    //             {user?.career_preferences?.[0]?.current_total_exp ? (
    //               <View style={styles.totalExp}>
    //                 <Ionicons name="briefcase" size={14} color="gray" />
    //                 <Text style={styles.applicationExpText}>
    //                   {user?.career_preferences?.[0]?.current_total_exp} years
    //                 </Text>
    //               </View>
    //             ) : null}

    //             {user?.career_preferences?.[0]?.current_annual_salary
    //               ?.amount ? (
    //               <View style={styles.iconTextSalaryContainer}>
    //                 <Ionicons name="cash" size={14} color="gray" />
    //                 <Text style={styles.salaryText}>
    //                   {formatAmount(
    //                     user?.career_preferences?.[0]?.current_annual_salary
    //                       ?.amount,
    //                   )}{' '}
    //                   {user?.career_preferences?.[0]?.current_annual_salary
    //                     ?.currency || ''}
    //                 </Text>
    //               </View>
    //             ) : null}

    //             {user?.career_preferences?.[0]?.notice_period ? (
    //               <View style={styles.iconTextContainer}>
    //                 <Ionicons name="time" size={16} color="gray" />
    //                 <Text style={styles.applicationNoticeText}>
    //                   {user?.career_preferences?.[0]?.notice_period}
    //                 </Text>
    //               </View>
    //             ) : null}
    //           </View>

    //           <View style={styles.locationContainer}>
    //             {user?.career_preferences?.[0]?.current_city && (
    //               <View style={styles.locationItem}>
    //                 <Ionicons name="location" size={14} color="gray" />
    //                 <Text style={styles.applicationLocationText}>
    //                   {user?.career_preferences?.[0]?.current_city}
    //                 </Text>

    //                 {Array.isArray(
    //                   user?.career_preferences?.[0]?.pref_locations,
    //                 ) &&
    //                   user?.career_preferences?.[0]?.pref_locations.length >
    //                     0 && (
    //                     <Text style={styles.applicationPrefLocationText}>
    //                       {' ('}
    //                       {user?.career_preferences?.[0]?.pref_locations.join(
    //                         ', ',
    //                       )}
    //                       {')'}
    //                     </Text>
    //                   )}
    //               </View>
    //             )}
    //           </View>
    //           {user?.career_preferences?.[0]?.expected_salary?.amount ? (
    //             <View style={styles.iconTextContainer}>
    //               <Text style={styles.applicationExpectedText}>
    //                 Expected Salary :
    //               </Text>
    //               <Text style={styles.salaryText}>
    //                 {formatAmount(
    //                   user?.career_preferences?.[0]?.expected_salary?.amount,
    //                 )}{' '}
    //                 {user?.career_preferences?.[0]?.expected_salary?.currency ||
    //                   ''}
    //               </Text>
    //             </View>
    //           ) : null}

    //           <ScrollView contentContainerStyle={styles.chipContainer}>
    //             {(showAllSkills ? allSkills : initialSkills).map(
    //               (skill, skillIndex) => (
    //                 <View key={skillIndex} style={styles.chip}>
    //                   <Text style={styles.chipText}>{skill}</Text>
    //                 </View>
    //               ),
    //             )}
    //             {user?.key_skills?.length > 4 && (
    //               <TouchableOpacity onPress={() => handleToggleViewMore(index)}>
    //                 <View style={styles.chip}>
    //                   <Text style={styles.chipViewText}>
    //                     {showAllSkills ? 'View Less' : 'View More'}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //             )}
    //           </ScrollView>
    //         </View>

    //         <View style={styles.buttonContainer}>
    //           <View style={styles.leftButtons}>
    //             <TouchableOpacity
    //               style={[styles.shortlistButton]}
    //               onPress={() => {
    //                 HandleShortlist(item);
    //               }}>
    //               <Text style={styles.circleButtonText}>Shortlist</Text>
    //             </TouchableOpacity>

    //             <TouchableOpacity
    //               style={[styles.circleButton, styles.deniedButton]}
    //               onPress={() => {
    //                 HandleDeny(item);
    //               }}>
    //               <Ionicons name="close-circle-outline" size={24} color="red" />
    //             </TouchableOpacity>
    //           </View>

    //           <TouchableOpacity
    //             style={[styles.circleButton, styles.callButton]}
    //             onPress={() => console.log('Call clicked')}>
    //             <Ionicons name="call" size={24} color="#1aa3ff" />
    //           </TouchableOpacity>
    //         </View>
    //       </TouchableOpacity>
    //     );
    //   })}
    // </ScrollView>

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Job Application Details</Text>
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
      )?.map((jobApplication, index) => {
        const user = jobApplication?.user_id;

        return (
          <UserCard
            key={index}
            item={user}
            jobId={jobId}
            page_name={'application'}
            index={index}
          />
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
});

export default ApplicationsListScreen;
