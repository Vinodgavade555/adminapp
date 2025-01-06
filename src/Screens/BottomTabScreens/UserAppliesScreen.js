import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
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

const jobDetails = [
  {
    id: 1,
    date: '2024-12-01',
    jobTitle: 'Software Engineer',
    applicationCount: 120,
    applications: [
      {
        id: 1,
        candidateDetails: {
          candidateName: 'John Doe',
          date: '2024-12-01',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-01',
              message: 'Application submitted.',
            },
          ],
          experience: '3 years',
          skills: ['JavaScript', 'React', 'Node.js'],
          education: 'B.Tech in Computer Science',
          contact: {
            email: 'johndoe@gmail.com',
            phone: '+1-123-456-7890',
          },
          address: {
            city: 'San Francisco',
            state: 'California',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/johndoe',
          profileSummary: 'Motivated software engineer...',
          certifications: ['Certified JavaScript Developer'],
          achievements: ['Built a high-traffic e-commerce platform.'],
        },
      },
      {
        id: 2,
        candidateDetails: {
          candidateName: 'Jane Smith',
          date: '2024-12-01',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-01',
              message: 'Application submitted.',
            },
            {
              status: 'Interview Scheduled',
              date: '2024-12-02',
              message: 'Interview scheduled.',
            },
          ],
          experience: '4 years',
          skills: ['Python', 'SQL', 'Data Visualization'],
          education: 'M.Sc. in Data Science',
          contact: {
            email: 'janesmith@gmail.com',
            phone: '+1-987-654-3210',
          },
          address: {
            city: 'New York',
            state: 'New York',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/janesmith',
          profileSummary: 'Data analyst with hands-on experience...',
          certifications: ['Google Data Analytics Certificate'],
          achievements: ['Automated reporting processes.'],
        },
      },
    ],
  },
  {
    id: 2,
    date: '2024-12-02',
    jobTitle: 'Data Analyst',
    applicationCount: 95,
    applications: [
      {
        id: 3,
        date: '2024-12-01',
        candidateDetails: {
          candidateName: 'Alex Johnson',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-01',
              message: 'Application submitted.',
            },
          ],
          experience: '2 years',
          skills: ['Excel', 'Tableau', 'SQL'],
          education: 'B.A. in Economics',
          contact: {
            email: 'alexj@gmail.com',
            phone: '+1-123-555-7890',
          },
          address: {
            city: 'Seattle',
            state: 'Washington',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/alexj',
          profileSummary: 'Entry-level data analyst...',
          certifications: ['Certified Tableau Analyst'],
          achievements: ['Built an interactive dashboard.'],
        },
      },
      {
        id: 4,
        candidateDetails: {
          candidateName: 'Emma White',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-01',
              message: 'Application submitted.',
            },
            {
              status: 'Application Viewed',
              date: '2024-12-02',
              message: 'Application reviewed.',
            },
          ],
          experience: '3 years',
          skills: ['SQL', 'Power BI', 'Python'],
          education: 'B.Sc. in Computer Science',
          contact: {
            email: 'emmaw@gmail.com',
            phone: '+1-222-654-3210',
          },
          address: {
            city: 'Austin',
            state: 'Texas',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/emmaw',
          profileSummary: 'Experienced data analyst...',
          certifications: ['Microsoft Power BI Certificate'],
          achievements: ['Streamlined data pipelines.'],
        },
      },
    ],
  },
  {
    id: 3,
    date: '2024-12-03',
    jobTitle: 'Backend Developer',
    applicationCount: 110,
    applications: [
      {
        id: 5,
        candidateDetails: {
          candidateName: 'Michael Green',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-02',
              message: 'Application submitted.',
            },
          ],
          experience: '5 years',
          skills: ['Node.js', 'Express', 'MongoDB'],
          education: 'M.Sc. in Software Engineering',
          contact: {
            email: 'michaelg@gmail.com',
            phone: '+1-321-876-5432',
          },
          address: {
            city: 'Chicago',
            state: 'Illinois',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/michaelg',
          profileSummary: 'Backend developer specializing in APIs...',
          certifications: ['Certified Backend Specialist'],
          achievements: ['Optimized API performance by 50%.'],
        },
      },
      {
        id: 6,
        candidateDetails: {
          candidateName: 'Sophia Brown',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-02',
              message: 'Application submitted.',
            },
          ],
          experience: '4 years',
          skills: ['Java', 'Spring Boot', 'Docker'],
          education: 'B.Sc. in Computer Science',
          contact: {
            email: 'sophiab@gmail.com',
            phone: '+1-444-765-8765',
          },
          address: {
            city: 'San Diego',
            state: 'California',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/sophiab',
          profileSummary: 'Efficient backend engineer...',
          certifications: ['Java Certified Professional'],
          achievements: ['Automated CI/CD pipelines.'],
        },
      },
    ],
  },
  {
    id: 4,
    date: '2024-12-04',
    jobTitle: 'Frontend Developer',
    applicationCount: 130,
    applications: [
      {
        id: 7,
        candidateDetails: {
          candidateName: 'Liam Turner',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-03',
              message: 'Application submitted.',
            },
          ],
          experience: '3 years',
          skills: ['React', 'JavaScript', 'HTML/CSS'],
          education: 'B.Sc. in Web Development',
          contact: {
            email: 'liamt@gmail.com',
            phone: '+1-555-543-1234',
          },
          address: {
            city: 'Denver',
            state: 'Colorado',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/liamt',
          profileSummary: 'Skilled in building responsive UIs...',
          certifications: ['React Developer Certificate'],
          achievements: ['Built interactive dashboards.'],
        },
      },
      {
        id: 8,
        candidateDetails: {
          candidateName: 'Olivia Green',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-03',
              message: 'Application submitted.',
            },
          ],
          experience: '2 years',
          skills: ['Angular', 'HTML/CSS', 'JavaScript'],
          education: 'B.A. in Graphic Design',
          contact: {
            email: 'oliviag@gmail.com',
            phone: '+1-111-432-8765',
          },
          address: {
            city: 'Los Angeles',
            state: 'California',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/oliviag',
          profileSummary: 'Frontend developer with creative designs...',
          certifications: ['Angular Developer Certificate'],
          achievements: ['Improved load time by 40%.'],
        },
      },
    ],
  },
  {
    id: 5,
    date: '2024-12-05',
    jobTitle: 'Data Scientist',
    applicationCount: 90,
    applications: [
      {
        id: 9,
        candidateDetails: {
          candidateName: 'Emily Johnson',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-04',
              message: 'Application submitted.',
            },
          ],
          experience: '5 years',
          skills: ['Python', 'R', 'Machine Learning'],
          education: 'M.Sc. in Data Science',
          contact: {
            email: 'emilyj@gmail.com',
            phone: '+1-789-543-2109',
          },
          address: {
            city: 'Austin',
            state: 'Texas',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/emilyj',
          profileSummary: 'Expert in machine learning models...',
          certifications: ['Certified Data Scientist'],
          achievements: ['Developed AI models for predictive analytics.'],
        },
      },
      {
        id: 10,
        candidateDetails: {
          candidateName: 'Noah Williams',
          statusHistory: [
            {
              status: 'Applied',
              date: '2024-12-04',
              message: 'Application submitted.',
            },
          ],
          experience: '3 years',
          skills: ['Python', 'Data Visualization', 'TensorFlow'],
          education: 'B.Sc. in Mathematics',
          contact: {
            email: 'noahw@gmail.com',
            phone: '+1-222-876-5432',
          },
          address: {
            city: 'San Francisco',
            state: 'California',
            country: 'USA',
          },
          resumeLink: 'https://example.com/resume/noahw',
          profileSummary: 'Data scientist with expertise in AI...',
          certifications: ['TensorFlow Certified Developer'],
          achievements: ['Built real-time dashboards.'],
        },
      },
    ],
  },
];

const rowsPerPageOptions = [10, 20];
const UserAppliesScreen = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [candidateModalVisible, setCandidateModalVisible] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  const {GetJobList, GetAppliedJobSeekerList} = JobViewController();
  const {JobList, JobSeekerList} = useSelector(state => state.job);

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
  // console.log('selectedJob:', JSON.stringify(selectedJob, null, 2));
  // const handleViewcandidateDetails = candidate => {
  //   console.log('Candidate Details:', JSON.stringify(candidate, null, 2));

  //   if (candidate?.id) {
  //     setSelectedCandidate(candidate.id); // Set selected candidate
  //     setCandidateModalVisible(true); // Open modal
  //     console.log('Selected Candidate ID:', candidate.id);
  //   } else {
  //     console.error('Invalid candidate data received:', candidate);
  //   }
  // };

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
                <View>
                  <CustomHeader />
                </View>
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
                        ? {uri: BASE_URL + selectedCandidate?.user?.profile_pic}
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
                    <Text style={styles.boldText}>Experience: </Text>
                    <Text style={styles.OutputText}>
                      {selectedCandidate?.career_preferences?.[0]
                        ?.current_total_exp || 'N/A'}{' '}
                      years
                    </Text>
                  </View>
                  <View style={styles.oddsection}>
                    <Text style={styles.boldText}>Address: </Text>
                    <Text style={styles.OutputText}>
                      {`${selectedCandidate?.career_preferences?.[0]?.current_city}`}
                    </Text>
                  </View>
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
                  <View
                    style={{
                      // paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor: '#fff',
                    }}>
                    <Text style={[styles.boldText, {paddingHorizontal: 12}]}>
                      IT Skills
                    </Text>
                    <ScrollView
                      horizontal
                      style={{flex: 1}}
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
                                justifyContent: 'flex-start',
                              },
                            ]}>
                            <Text style={[styles.OutputText]}>
                              {skill?.name === 'Other'
                                ? skill?.othername
                                : skill?.name || 'N/A'}
                            </Text>
                            <Text style={styles.OutputText}>
                              {`${skill?.exp?.years || 0} years, ${
                                skill?.exp?.months || 0
                              } months`}
                            </Text>
                            <Text style={styles.OutputText}>
                              <Text style={styles.boldText}>Last Used: </Text>
                              {skill?.last_used || 'N/A'}
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
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor: '#fafafa',
                    }}>
                    <Text style={styles.boldText}> Education</Text>
                    {selectedCandidate?.higher_edu?.length > 0 ? (
                      selectedCandidate?.higher_edu?.map((edu, index) => (
                        <View
                          key={`edu_${index}`}
                          style={[styles.section, {marginVertical: 12}]}>
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
                      ))
                    ) : (
                      <Text style={styles.OutputText}>
                        No higher education records available.
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: '#fff',
                  }}>
                  <Text style={[styles.boldText]}>Project details</Text>
                  {selectedCandidate?.project_details?.length > 0 ? (
                    selectedCandidate?.project_details?.map((pro, index) => (
                      <View
                        key={`pro_${index}`}
                        style={[
                          styles.section,
                          {
                            marginVertical: 12,
                            padding: 12,
                            backgroundColor: '#fafafa',
                            borderRadius: 8,
                          },
                        ]}>
                        <View style={{flexDirection: 'row', gap: 8}}>
                          <Text
                            style={{color: colors.primary, fontWeight: 'bold'}}>
                            {pro.role || 'N/A'} /
                          </Text>

                          <Text style={styles.OutputText}>
                            {pro.client || 'N/A'}
                          </Text>
                        </View>
                        <Text style={{color: colors.primary}}>
                          {pro.description || 'N/A'} -
                        </Text>
                        <View
                          style={{
                            // paddingHorizontal: 12,
                            paddingVertical: 12,
                          }}>
                          <View style={styles.chipContainer}>
                            {Array.isArray(pro?.skills_used) &&
                            pro.skills_used.length > 0 ? (
                              pro.skills_used.map((skill, index) => (
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
                      </View>
                    ))
                  ) : (
                    <Text style={styles.OutputText}>
                      No higher Project records available.
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
  },
  boldText: {
    width: width * 0.4,
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 13,
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
