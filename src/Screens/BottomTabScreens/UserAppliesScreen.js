import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomDataTable from '../../Constant/CustomDataTable';
import {Text} from 'react-native-paper';
import moment from 'moment';
import {colors} from '../../Global_CSS/TheamColors';
import CustomHeader from '../../Constant/CustomBackIcon';
import JobViewController from '../../Redux/Action/JobViewController';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../Services/baseAPI';
const {width} = Dimensions.get('window'); // Get the screen width

const rowsPerPageOptions = [10, 20];
const UserAppliesScreen = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [candidateModalVisible, setCandidateModalVisible] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  // const {GetJobList, GetAppliedJobSeekerList} = JobViewController();
  // const {JobList, JobSeekerList} = useSelector(state => state.job);

  const {GetJobList} = JobViewController();
  const {JobList} = useSelector(state => state.job);

  console.log('$$$$$$$$$$$$$$',GetJobList);
  

  

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_data');
        setId(userId);
        if (userId) {
          dispatch(GetJobList(userId));
        }
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewApplicants = id => {
    dispatch(GetAppliedJobSeekerList(id)); // Fetch job applicants

    setSelectedJob(JobSeekerList); // Set the selected job ID
    setModalVisible(true); // Show the modal
  };

  const handleViewcandidateDetails = candidateId => {
    // Find the candidate in selectedJob using the `id`
    const candidate = selectedJob.find(
      job => job.user.id === candidateId.id,
    )?.user;

    // Debugging the found candidate
    // console.log('View Candidate Details:', JSON.stringify(candidate, null, 2));

    if (candidate) {
      console.log('Selected Candidate:', candidate);
      setSelectedCandidate(candidate); // Set the selected candidate
      setCandidateModalVisible(true); // Open modal
    } else {
      console.error(`Candidate with ID ${candidateId.id} not found.`);
    }
  };

  console.log('data', JSON.stringify(selectedCandidate, null, 2));

  const preprocessJobData = (data = []) => {
    if (!Array.isArray(data)) {
      console.warn('preprocessData received invalid data:', data);
      return [];
    }
    return data.map(job => ({
      createdAt: moment(job.created_at).format('DD MMM YYYY'),
      jobTitle: job.job_title?.title || null, // Extract title safely
      applicantCount: job.applicant_count || 0, // Default to 0 if undefined\
      id: job.id,
    }));
  };

  const processedJobs = preprocessJobData(JobList.results || []);
  // console.log('JobList', JSON.stringify(processedJobs, null, 2));

  // Function to handle modal close
  const handleModalClose = () => {
    setCandidateModalVisible(false); // Close modal
    setSelectedCandidate(null); // Reset selected candidate to null
  };
  return (
    <View style={styles.container}>
      <CustomDataTable
        columns={[
          {header: 'Date', field: 'createdAt'},
          {header: 'Job Title', field: 'jobTitle'},
          {header: 'Application Count', field: 'applicantCount'},
          {header: 'Job Applications', field: 'action'},
        ]}
        data={processedJobs}
        actions={[
          {
            label: 'View All Applications',
            onPress: job => handleViewApplicants(job.id),
          },
          {
            label: 'Applies',
            onPress: job => handleApplies(job.id), // Replace handleApplies with your function for handling the "Applies" action
          },
        ]}
        rowsPerPageOptions={rowsPerPageOptions}
      />

      {/* Modal for Applications */}
      {selectedJob && Array.isArray(selectedJob) && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Applications</Text>
              <CustomDataTable
                columns={[
                  {
                    header: 'Date Applied',
                    field: 'applicationDate',
                  },
                  {
                    header: 'Candidate Name',
                    field: 'name',
                  },
                  {
                    header: 'Experience',
                    field: 'experience',
                  },
                  {
                    header: 'Phone Number',
                    field: 'phoneNo',
                  },
                  {
                    header: 'Email',
                    field: 'email',
                  },
                  {header: 'Candidate Details', field: 'action'},
                ]}
                data={selectedJob.map(application => ({
                  id: application.user?.user_id, // Include the application ID here
                  applicationDate: moment(application.application_date).format(
                    'DD MMM YYYY',
                  ),
                  name:
                    application.user?.first_name && application.user?.last_name
                      ? `${application.user.first_name} ${application.user.last_name}`
                      : application.user?.email || 'N/A',
                  experience:
                    application.user?.career_preferences?.[0]
                      ?.current_total_exp || 'N/A',
                  phoneNo: application.user?.mobile_number || 'N/A',
                  email: application.user?.email || 'N/A',
                }))}
                actions={[
                  {
                    label: 'View Details',
                    onPress: application =>
                      handleViewcandidateDetails(application),

                    // Pass the application ID
                  },
                ]}
                rowsPerPageOptions={[5, 10]}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for Candidate Details */}
      {candidateModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => setCandidateModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => handleModalClose()}>
                  <CustomHeader />
                </TouchableOpacity>
                <View>
                  <Text style={styles.CandidatemodalTitle}>
                    Candidate Details
                  </Text>
                </View>
                <View />
              </View>

              <ScrollView>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fafafa',
                    padding: 12,
                  }}>
                  <Image
                    source={
                      selectedCandidate?.user?.profile_photo
                        ? {uri: BASE_URL + selectedCandidate?.profile_photo}
                        : require('../../Assets/Images/Userimage.png')
                    }
                    style={styles.profileimage}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      marginHorizontal: 12,
                    }}>
                    {console.log(
                      'selectedCandidate details ',
                      selectedCandidate?.email,
                    )}
                    <Text style={styles.NameText}>
                      {selectedCandidate?.first_name &&
                      selectedCandidate?.last_name
                        ? `${selectedCandidate?.first_name} ${selectedCandidate?.last_name}`
                        : 'Candidate Name'}
                    </Text>
                    <Text style={styles.headlineText}>
                      {selectedCandidate?.profile_headline ||
                        'Experienced Mobile Developer | Proficient in React Native, Redux,and APIs'}
                    </Text>
                    {/* <Text style={styles.emailText}>
                      {selectedCandidate?.user?.email || 'N/A'}
                    </Text>
                    <Text style={styles.mobilenumber}>
                      {selectedCandidate?.user?.mobile_number || 'N/A'}
                    </Text> */}
                  </View>
                </View>

                <View style={{marginTop: 12, paddingVertical: 4}}>
                  <View style={styles.evensection}>
                    <Text style={styles.boldText}>Email</Text>
                    <Text style={styles.emailText}>
                      {selectedCandidate?.email || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.oddsection}>
                    <Text style={styles.boldText}>Phone Number</Text>
                    <Text style={styles.mobilenumber}>
                      {selectedCandidate?.mobile_number || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.evensection}>
                    <Text style={styles.boldText}>Experience </Text>
                    <Text style={styles.OutputText}>
                      {selectedCandidate?.career_preferences?.[0]?.total_exp ||
                        'N/A'}{' '}
                      years
                    </Text>
                  </View>
                  <View style={styles.oddsection}>
                    <Text style={styles.boldText}>Address </Text>
                    <Text style={styles.OutputText}>
                      {`${
                        selectedCandidate?.basic_details?.[0]?.home_city ||
                        'N/A'
                      }, ${
                        selectedCandidate?.basic_details?.[0]?.country || 'N/A'
                      }`}
                    </Text>
                  </View>
                  <View style={styles.evensection}>
                    <Text style={styles.boldText}>Current Annual Salary </Text>
                    <Text style={styles.OutputText}>
                      {selectedCandidate?.career_preferences?.[0]?.annual_salary
                        ?.amount
                        ? `${
                            selectedCandidate?.career_preferences?.[0]
                              ?.annual_salary?.currency
                          } ${selectedCandidate?.career_preferences?.[0]?.annual_salary?.amount.toLocaleString()}`
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.oddsection}>
                    <Text style={styles.boldText}>Notice Period</Text>
                    <Text style={styles.OutputText}>
                      {selectedCandidate?.career_preferences?.[0]
                        ?.notice_period || 'N/A'}
                    </Text>
                  </View>
                  {/* Skills */}
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor: '#fafafa',
                    }}>
                    <Text style={styles.boldText}>Skills</Text>
                    <View style={styles.chipContainer}>
                      {selectedCandidate?.key_skills?.length > 0 ? (
                        selectedCandidate?.key_skills?.map((skill, index) => (
                          <Text key={index} style={styles.chip}>
                            {skill}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.OutputText}>
                          No skills available
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* It Skills ans experience */}
                  <View
                    style={{
                      // paddingHorizontal: 12,
                      paddingVertical: 12,
                      // backgroundColor: '#fff',
                    }}>
                    <Text
                      style={[styles.boldTextSkill, {paddingHorizontal: 12}]}>
                      IT Skills & Experience
                    </Text>
                    <ScrollView
                      horizontal
                      contentContainerStyle={{
                        flexDirection: 'row',
                        gap: 8, // Adding spacing between items
                        paddingHorizontal: 10, // Optional padding for better alignment
                      }}
                      showsHorizontalScrollIndicator={false} // Hide scroll bar for a cleaner look
                    >
                      {selectedCandidate?.it_skills?.length > 0 ? (
                        selectedCandidate?.it_skills.map((skill, index) => (
                          <View
                            key={`it_skill_${index}`}
                            style={[
                              styles.skillSection,
                              {
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: '#f1f1f1',
                                color: colors.primary,
                                height: 'auto',
                                flex: 1,
                                // justifyContent: 'flex-start',
                              },
                            ]}>
                            <Text
                              style={{
                                fontWeight: '600',
                                color: colors.primary,
                                fontSize: 13,
                              }}>
                              {skill?.name === 'Other'
                                ? skill?.othername
                                : skill?.name || 'N/A'}
                              {` (${skill?.exp?.years || 0}.${
                                skill?.exp?.months || 0
                              } year)`}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.OutputText}>
                          No IT skills available.
                        </Text>
                      )}
                    </ScrollView>
                  </View>

                  <View>
                    <Text style={styles.boldText}>Career Preferences</Text>

                  </View>

                  {/* Education */}
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor: '#fafafa',
                    }}>
                    <Text style={styles.boldText}>Education</Text>
                    {selectedCandidate?.higher_edu?.length > 0 ? (
                      <ScrollView
                        horizontal
                        contentContainerStyle={{
                          flexDirection: 'row',
                          gap: 12,
                        }}
                        showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
                      >
                        {selectedCandidate?.higher_edu?.map((edu, index) => (
                          <View
                            key={`edu_${index}`}
                            style={[
                              styles.section,
                              {
                                padding: 12,
                                backgroundColor: '#fff',
                                borderRadius: 8,
                                height: 'auto',
                                flex: 1,
                              },
                            ]}>
                            <View style={{flexDirection: 'row', gap: 8}}>
                              <Text style={{color: colors.primary}}>
                                {edu.course_name || 'N/A'} -
                              </Text>
                              <Text style={{color: colors.primary}}>
                                {edu.specialization || 'N/A'} -
                              </Text>
                              <Text style={{color: colors.primary}}>
                                {edu.duration?.start_year || 'N/A'} -{' '}
                                {edu.duration?.end_year || 'N/A'}
                              </Text>
                            </View>
                            <Text style={styles.OutputText}>
                              {edu.university_name || 'N/A'}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <Text style={styles.OutputText}>
                        No higher education records available.
                      </Text>
                    )}
                  </View>
                </View>
                {/* //Project Details */}
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: '#fff',
                  }}>
                  <Text style={[styles.boldText]}>Project details</Text>
                  {selectedCandidate?.project_details?.length > 0 ? (
                    <ScrollView
                      horizontal
                      contentContainerStyle={{
                        flexDirection: 'row', // Ensures project sections are displayed horizontally
                        gap: 16, // Adds spacing between each project section
                      }}
                      showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
                    >
                      {selectedCandidate?.project_details?.map((pro, index) => (
                        <View
                          key={`pro_${index}`}
                          style={[
                            styles.section,
                            {
                              padding: 12,
                              backgroundColor: '#fafafa',
                              borderRadius: 8,
                              width: width * 0.7, // Fixed width for each project section (you can adjust this based on your design)
                            },
                          ]}>
                          {pro.role ? (
                            <Text
                              style={{
                                color: colors.primary,
                                fontWeight: 'bold',
                              }}>
                              {pro.role}
                            </Text>
                          ) : null}

                          <View style={{marginVertical: 6}}>
                            {pro.title && (
                              <Text style={styles.OutputText}>{pro.title}</Text>
                            )}

                            {pro.description ? (
                              <Text style={{color: colors.primary}}>
                                {pro.description}
                              </Text>
                            ) : null}

                            {pro.worked_duration?.from &&
                              pro.worked_duration?.till && (
                                <Text style={styles.OutputTextWork}>
                                  Worked Duration :
                                  {moment(pro.worked_duration.from).format(
                                    'D MMM YY',
                                  )}{' '}
                                  -{' '}
                                  {moment(pro.worked_duration.till).format(
                                    'D MMM YY',
                                  )}
                                </Text>
                              )}
                          </View>

                          <View style={{paddingVertical: 4}}>
                            {Array.isArray(pro?.skills_used) &&
                            pro.skills_used.length > 0 ? (
                              <View style={styles.chipContainer}>
                                {pro.skills_used.map((skill, index) => (
                                  <Text key={index} style={styles.chip}>
                                    {skill}
                                  </Text>
                                ))}
                              </View>
                            ) : null}
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.OutputText}>
                      No higher Project records available.
                    </Text>
                  )}
                </View>

                {/* Languages */}
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: '#fafafa',
                  }}>
                  <Text style={styles.boldText}>Languages</Text>
                  {selectedCandidate?.languages?.length > 0 ? (
                    <ScrollView
                      horizontal
                      contentContainerStyle={{
                        flexDirection: 'row',
                        gap: 12,
                      }}
                      showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
                    >
                      {selectedCandidate?.languages?.map((language, index) => (
                        <View
                          key={`language_${index}`}
                          style={[
                            styles.section,
                            {
                              padding: 12,
                              backgroundColor: '#fff',
                              borderRadius: 8,
                              height: 'auto',
                              flex: 1,
                            },
                          ]}>
                          <View style={{flexDirection: 'row', gap: 8}}>
                            <Text
                              style={{
                                color: colors.primary,
                                fontWeight: 'bold',
                              }}>
                              {language.name || 'N/A'}
                            </Text>
                          </View>
                          <Text style={styles.OutputText}>
                            {language.comfortable_in?.join(', ') || 'N/A'}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.OutputText}>
                      No language records available.
                    </Text>
                  )}
                </View>

                {/* accomplishments */}

                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: '#fafafa',
                  }}>
                  <Text style={styles.boldText}>Accomplishments</Text>
                  {selectedCandidate?.accomplishments?.length > 0 ? (
                    <ScrollView
                      horizontal
                      contentContainerStyle={{
                        flexDirection: 'row',
                        gap: 12, // Space between items
                      }}
                      showsHorizontalScrollIndicator={false} // Optional: hides the scroll indicator
                    >
                      {selectedCandidate?.accomplishments?.map(
                        (accomplishment, index) => (
                          <View
                            key={`accomplishment_${index}`}
                            style={[
                              styles.section,
                              {
                                padding: 12,
                                backgroundColor: '#fff',
                                borderRadius: 8,
                                minWidth: 250, // Minimum width for each accomplishment card
                                marginRight: 12, // Space between cards horizontally
                              },
                            ]}>
                            
                            <Text
                              style={{
                                color: colors.primary,
                                fontWeight: 'bold',
                                marginBottom: 4, // Space below the title
                              }}>
                              {accomplishment.title || 'N/A'}
                            </Text>

                            
                            {accomplishment.certificationProvider && (
                              <Text style={styles.OutputText}>
                                <Text style={{fontWeight: 'bold'}}>
                                  Certification Provider:{' '}
                                </Text>
                                {accomplishment.certificationProvider || 'N/A'}
                              </Text>
                            )}

                            
                            {accomplishment.description && (
                              <Text style={styles.OutputText}>
                                <Text style={{fontWeight: 'bold'}}>
                                  Description:{' '}
                                </Text>
                                {accomplishment.description ||
                                  'No description available'}
                              </Text>
                            )}

                           
                            {accomplishment.issued_date && (
                              <Text style={styles.OutputText}>
                                <Text style={{fontWeight: 'bold'}}>
                                  Issued Date:{' '}
                                </Text>
                                {accomplishment.issued_date || 'N/A'}
                              </Text>
                            )}

                          
                            {accomplishment.expiry_date && (
                              <Text style={styles.OutputText}>
                                <Text style={{fontWeight: 'bold'}}>
                                  Expiry Date:{' '}
                                </Text>
                                {accomplishment.expiry_date || 'N/A'}
                              </Text>
                            )}

                            {/* Published Date */}
                            {accomplishment.published_date && (
                              <Text style={styles.OutputText}>
                                <Text style={{fontWeight: 'bold'}}>
                                  Published Date:{' '}
                                </Text>
                                {accomplishment.published_date || 'N/A'}
                              </Text>
                            )}

                            
                            {accomplishment.url && (
                              <Text
                                style={styles.OutputText}
                                onPress={() =>
                                  Linking.openURL(accomplishment.url)
                                }>
                                <Text style={{fontWeight: 'bold'}}>Link: </Text>
                                {accomplishment.url}
                              </Text>
                            )}

                            {/* Name */}
                            {accomplishment.name && (
                              <Text style={styles.OutputText}>
                                <Text style={{fontWeight: 'bold'}}>Name: </Text>
                                {accomplishment.name || 'N/A'}
                              </Text>
                            )}

                            {/* Title (again if you want to show it at the bottom as well) */}
                            {accomplishment.title && (
                              <Text style={styles.OutputText}>
                                <Text style={{fontWeight: 'bold'}}>
                                  Title:{' '}
                                </Text>
                                {accomplishment.title || 'N/A'}
                              </Text>
                            )}
                          </View>
                        ),
                      )}
                    </ScrollView>
                  ) : (
                    <Text style={styles.OutputText}>
                      No accomplishments records available.
                    </Text>
                  )}
                </View>

                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Profile Summary: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate?.profileSummary}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Certifications: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate?.certifications?.join(', ')}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Achievements: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate?.achievements?.join(', ')}
                  </Text>
                </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleModalClose()}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  boldText: {
    width: width * 0.4,
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 13,
    marginBottom: 8,
  },
  boldTextSkill: {
    width: width * 0.6,
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 13,
    marginBottom: 8,
  },
  chipContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    fontSize: 12,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
    color: colors.primary,
  },
  NameText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 16,
  },
  headlineText: {
    fontWeight: '600',
    color: colors.primary,
    fontSize: 13,
  },
  emailText: {
    fontWeight: '600',
    color: colors.secondary,
    fontSize: 13,
  },
  mobilenumber: {
    fontWeight: '600',
    color: colors.secondary,
    fontSize: 13,
  },
  OutputText: {
    width: width * 0.55,
    fontWeight: '600',
    color: colors.primary,
    fontSize: 13,
  },
  OutputTextWork: {
    width: width * 0.7,
    fontWeight: '600',
    color: colors.primary,
    fontSize: 13,
  },
  modalHeader: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profileimage: {
    padding: 12,
    width: 120,
    height: 120,
    borderRadius: 50,
  },
  CandidatemodalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  educationItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  evensection: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  oddsection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default UserAppliesScreen;
