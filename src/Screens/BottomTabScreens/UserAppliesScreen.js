import React, {useEffect, useState} from 'react';
import {
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

  const {GetJobList} = JobViewController();
  const {JobList} = useSelector(state => state.job);

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

  const handleViewApplicants = job => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleViewDetails = candidate => {
    setSelectedCandidate(candidate);
    setCandidateModalVisible(true);
  };
  // console.log('JobList', JSON.stringify(JobList, null, 2));
  const preprocessData = (data = []) => {
    // Validate that data is an array
    if (!Array.isArray(data)) {
      console.warn('preprocessData received invalid data:', data);
      return [];
    }

    // Map through each item to extract specific fields
    return data.map(job => ({
      createdAt: moment(job.created_at).format('DD MMM YYYY'),
      jobTitle: job.job_title?.title || null, // Extract title safely
      applicantCount: job.applicant_count || 0, // Default to 0 if undefined
    }));
  };

  console.log('preprocessData', JSON.stringify(preprocessData, null, 2));

  const processedJobs = preprocessData(JobList.results || []);
  console.log('JobList', JSON.stringify(processedJobs, null, 2));
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
        actions={[{label: 'View All Applications', onPress: handleViewApplicants}]}
        rowsPerPageOptions={rowsPerPageOptions}
      />

      {/* Modal for Applications */}
      {selectedJob && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Applications for {selectedJob.jobTitle}
              </Text>
              <CustomDataTable
                columns={[
                  {
                    header: 'Date Applied',
                    field: 'candidateDetails.formattedDate',
                  },
                  {
                    header: 'Candidate Name',
                    field: 'candidateDetails.candidateName',
                  },
                  {
                    header: 'Experience',
                    field: 'candidateDetails.experience',
                  },
                  {
                    header: 'Phone Number',
                    field: 'candidateDetails.contact.phone',
                  },
                  {header: 'Email', field: 'candidateDetails.contact.email'},
                  {header: 'Candidate Details', field: 'action'},
                ]}
                data={selectedJob.applications} // Pass the applications array directly
                actions={[
                  {
                    label: 'View Details',
                    onPress: item => handleViewDetails(item.candidateDetails),
                  },
                ]}
                rowsPerPageOptions={[5, 10]}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for Candidate Details */}
      {selectedCandidate && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={candidateModalVisible}
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
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Name: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.candidateName}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Date Applied: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.formattedDate}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Experience: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.experience}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Skills: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.skills.join(', ')}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Education: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.education}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Email: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.contact.email}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Phone: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.contact.phone}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Address: </Text>
                  <Text style={styles.OutputText}>
                    {`${selectedCandidate.address.city}, ${selectedCandidate.address.state}, ${selectedCandidate.address.country}`}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Profile Summary: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.profileSummary}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Certifications: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.certifications.join(', ')}
                  </Text>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Achievements: </Text>
                  <Text style={styles.OutputText}>
                    {selectedCandidate.achievements.join(', ')}
                  </Text>
                </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCandidateModalVisible(false)}>
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
    padding: 20,
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
    flex: 1,
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 13,
  },
  OutputText: {
    flex: 1,
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
  CandidatemodalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
  },
});

export default UserAppliesScreen;
