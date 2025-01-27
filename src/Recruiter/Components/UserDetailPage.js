import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  BackHandler,
} from 'react-native';
import {colors} from '../../Global_CSS/TheamColors';
import moment from 'moment';
const {width} = Dimensions.get('window');
import {useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewPage from '../../Constant/CustomReviewPage';
import JobViewController from '../RecruiterRedux/Action/JobViewController';
import WebView from 'react-native-webview';

const UserDetailScreen = ({route, onShortlist}) => {
  const {data, page} = route.params;
  const {SendInvitation, ApplicationJobStatus} = JobViewController();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [id, setId] = useState('');
  const [status, setStatus] = useState(data?.status || 'APPLIED');
  const [buttonPressed, setButtonPressed] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile Details');

  const [isShortlisted, setIsShortlisted] = useState(
    data?.is_shortlisted || false,
  );
  const user = data?.user ? data.user : data.user_id;
  // console.log(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEmploymentModalVisible, setEmploymentModalVisible] = useState(false);
  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [url, setUrl] = useState(null);
  const [isWebViewVisible, setWebViewVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  const webViewRef = useRef(null); // WebView reference// Handle back button press
  const handleBackPress = () => {
    if (webViewRef.current && webViewRef.current.canGoBack()) {
      webViewRef.current.goBack();
      return true;
    }
    return false; // Default behavior
  };
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleLinkPress = url => {
    setUrl(url);
    setWebViewVisible(true); // Show WebView modal when link is clicked
  };
  // Function to close WebView modal
  const closeWebView = () => {
    setWebViewVisible(false); // Close the WebView
  };

  // Handle the hardware back button on Android to close the WebView
  useEffect(() => {
    const backAction = () => {
      if (isWebViewVisible) {
        closeWebView(); // Close WebView on back button press
        return true; // Prevent default back behavior (navigation)
      }
      return false; // Allow default back action if WebView is not visible
    };

    // Add event listener for the hardware back button
    BackHandler.addEventListener('hardwareBackPress', backAction);

    // Cleanup the event listener on component unmount
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [isWebViewVisible]);
  // Open modal with the selected project details
  const openModal = project => {
    setSelectedProject(project);
    toggleModal();
  };

  const openAccomplishmentModal = accomplishment => {
    setSelectedAccomplishment(accomplishment);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAccomplishment(null);
  };

  const groupAccomplishmentsByName = accomplishments => {
    return accomplishments.reduce((groups, accomplishment) => {
      const name = accomplishment.name || 'Unnamed';
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(accomplishment);
      return groups;
    }, {});
  };

  // Group accomplishments by name
  const groupedAccomplishments = groupAccomplishmentsByName(
    user?.accomplishments || [],
  );

  const handleSendInvitation = () => {
    const invitationData = {
      job: data?.jobId,
      user_id: data?.user?.id,
      created_by: id,
    };

    dispatch(SendInvitation(invitationData));
  };

  const handleApplicationStatus = () => {
    let context = {};

    if (data?.status === 'APPLICATION VIEWED') {
      context = {
        status: 'ACCEPTED',
        message: 'Application accepted successfully',
      };
    } else if (data?.status === 'ACCEPTED') {
      context = {
        status: 'INTERVIEW',
        message: 'INTERVIEW SCHEDULE successfully',
      };
    } else if (data?.status === 'INTERVIEW') {
      context = {
        status: 'HIRED',
        message: 'Candidate Hired',
      };
    }

    dispatch(ApplicationJobStatus(data?.id, context, data?.job));
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

  const statusColors = {
    ACCEPTED: {background: '#d6f5d6', text: '#33cc33'},
    INTERVIEW: {background: '#ffe0b3', text: '#ff9800'},
    REJECTED: {background: '#f8d7da', text: '#dc3545'},
    APPLIED: {background: '#d1ecf1', text: '#18464e'},
    HIRED: {background: '#155724', text: '#fff'},
  };
  const buttonBackgroundColor =
    statusColors[status]?.background || defaultColor;
  const buttonTextColor = statusColors[status]?.text || '#ffffff';

  const handleToggle = () => {
    setIsShortlisted(!isShortlisted); // Toggle the state
  };
  const openEmploymentModal = employment => {
    setSelectedEmployment(employment);
    setEmploymentModalVisible(true);
  };

  const closeEmploymentModal = () => {
    setEmploymentModalVisible(false);
  };

  const showButtons = page === 'application' || page === 'job_invitation';

  const defaultColor = '#004466';

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

  const getFormattedNoticePeriod = noticePeriod => {
    if (!noticePeriod) return 'N/A';

    if (noticePeriod.toLowerCase() === 'immediate') {
      return 'Immediate Available ';
    }

    const daysMatch = noticePeriod.match(/(\d+)\s*(day|days?)/i);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      return `${days} days availability`;
    }

    const monthsMatch = noticePeriod.match(/(\d+)\s*(month|months?)/i);
    if (monthsMatch) {
      const months = parseInt(monthsMatch[1], 10);
      const days = months * 30;
      return `${days} days availability`;
    }

    return noticePeriod;
  };

  const getOnlineStatus = (isOnline, lastSeen) => {
    if (isOnline) {
      return {
        onlineStatus: 'Currently Online', // Display if the user is online
        statusColor: 'gray',
        dotColor: '#28a745', // Green for online
      };
    }

    const lastSeenTime = lastSeen
      ? `Last seen: ${moment(lastSeen).format('Do MMM YY, h:mm a')}`
      : 'Offline';

    return {
      onlineStatus: lastSeenTime,
      statusColor: 'gray',
      dotColor: '#ff0000', // Red for offline
    };
  };

  const {onlineStatus, statusColor, dotColor} = getOnlineStatus(
    user?.is_online,
    user?.last_seen,
  );
  useEffect(() => {
    if (data?.user?.work_availability?.length > 0) {
      setSelectedMode(data.user.work_availability[0].mode);
    }
  }, [data]);

  const handleChipClick = mode => {
    setSelectedMode(mode);
  };

  const getSlots = mode => {
    const selected = data.user.work_availability.find(
      item => item.mode === mode,
    );
    return selected ? selected.slots : [];
  };

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

  const currentJob = data?.user?.employment_details?.find?.(
    job => job.is_current_company === 'true',
  );

  const experienceText = currentJob
    ? `${currentJob?.job_title} at ${currentJob?.company_name}`
    : null;

  const renderTabs = () => {
    switch (activeTab) {
      case 'Profile Details':
        return (
          <ScrollView
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={false}>
            {/* Skills */}
            <View>
              <Text style={styles.boldText}>Skills</Text>
              <View style={styles.chipContainer}>
                {user?.key_skills?.length > 0 ? (
                  user?.key_skills?.map((skill, index) => (
                    <Text key={index} style={styles.chip}>
                      {skill}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.OutputText}>No skills available</Text>
                )}
              </View>
            </View>

            {/* It Skills ans experience */}
            <View
              style={{
                paddingVertical: 12,
              }}>
              <Text style={[styles.boldTextSkill]}>IT Skills & Experience</Text>
              <ScrollView
                contentContainerStyle={{
                  flexDirection: 'column',
                  gap: 8,
                }}>
                {user?.it_skills?.length > 0 ? (
                  user.it_skills.map((skill, index) => (
                    <View
                      key={`it_skill_${index}`}
                      style={[
                        styles.skillSection,
                        {
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: '#f1f1f1',
                          flex: 1,
                        },
                      ]}>
                      <Text style={{fontSize: 13}}>
                        <Text
                          style={{
                            fontWeight: '600',
                            color: colors.primary,
                          }}>
                          {skill?.name === 'Other'
                            ? skill?.othername
                            : skill?.name || 'N/A'}
                        </Text>
                        <Text
                          style={{
                            fontWeight: '400',
                            color: 'gray',
                          }}>
                          {` (${skill?.exp?.years || 0}.${
                            skill?.exp?.months || 0
                          } year)`}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.OutputText}>No IT skills available.</Text>
                )}
              </ScrollView>
            </View>

            {/* Education */}
            <View>
              <Text style={styles.boldText}>Education</Text>
              {user?.higher_edu?.length > 0 ? (
                <ScrollView
                  contentContainerStyle={{
                    flexDirection: 'column',
                    gap: 12,
                  }}>
                  {user.higher_edu.map((edu, index) => (
                    <View
                      key={`edu_${index}`}
                      style={[
                        styles.section,
                        {
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: '#fafafa',
                          height: 'auto',
                          flex: 1,
                        },
                      ]}>
                      {edu.course_name && (
                        <Text style={{color: colors.primary}}>
                          {edu.course_name}
                          {edu.specialization && (
                            <Text style={{color: colors.primary}}>
                              {' - '}
                              {edu.specialization}
                            </Text>
                          )}
                          {(edu.duration?.start_year ||
                            edu.duration?.end_year) && (
                            <Text style={{color: 'gray', fontSize: 12}}>
                              {' '}
                              ({edu.duration?.start_year || ''} -{' '}
                              {edu.duration?.end_year || ''})
                            </Text>
                          )}
                        </Text>
                      )}

                      {edu.university_name && (
                        <Text style={[styles.OutputText]}>
                          {edu.university_name}
                        </Text>
                      )}
                    </View>
                  ))}
                </ScrollView>
              ) : null}
            </View>

            {/* Languages */}
            <View>
              {user?.languages?.length > 0 ? (
                <>
                  <Text style={styles.boldText}>Languages</Text>
                  <View
                    style={{
                      flexDirection: 'column',
                      gap: 12,
                    }}>
                    {user?.languages?.map((language, index) => (
                      <View
                        key={`language_${index}`}
                        style={[
                          styles.section,
                          {
                            paddingVertical: 12,
                            paddingHorizontal: 12,
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            height: 'auto',
                            flex: 1,
                            backgroundColor: '#fafafa',
                          },
                        ]}>
                        <View style={{flexDirection: 'row', gap: 8}}>
                          {language.name && (
                            <Text
                              style={{
                                color: colors.primary,
                                fontWeight: 'bold',
                              }}>
                              {language.name}
                            </Text>
                          )}
                          {language.comfortable_in &&
                            language.comfortable_in.length > 0 && (
                              <Text style={styles.OutputText}>
                                ({language.comfortable_in.join(', ')})
                              </Text>
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}
            </View>

            {/* accomplishments */}
            <View>
              <Text style={styles.boldTextAccomplishment}>
                Accomplishments:
              </Text>

              {user?.accomplishments?.length > 0 ? (
                <ScrollView
                  contentContainerStyle={{flexDirection: 'column', gap: 2}}
                  showsVerticalScrollIndicator={false}>
                  {Object.keys(groupedAccomplishments).map((name, index) => (
                    <View
                      key={`accomplishment_group_${index}`}
                      style={{marginBottom: 8}}>
                      <Text style={styles.boldText}>{name}</Text>

                      {/* ScrollView for Horizontal Scrolling */}
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <View
                          style={{flexDirection: 'row', flexWrap: 'nowrap'}}>
                          {groupedAccomplishments[name].map(
                            (accomplishment, idx) => (
                              <View
                                key={`accomplishment_${idx}`}
                                style={[
                                  styles.section,
                                  {
                                    paddingHorizontal: 8,
                                    paddingVertical: 12,
                                    backgroundColor: '#fafafa',
                                    borderRadius: 8,
                                    width: width * 0.7,
                                    marginRight: 8, // Space between items
                                  },
                                ]}>
                                {/* Show Name First */}
                                {accomplishment.name ? (
                                  <Text
                                    style={{
                                      color: colors.primary,
                                      fontWeight: 'bold',
                                      marginBottom: 4,
                                    }}>
                                    {accomplishment.name}
                                  </Text>
                                ) : null}

                                {/* Show Title After Name */}
                                {accomplishment.title ? (
                                  <Text
                                    style={{
                                      color: 'gray',
                                      fontWeight: 'bold',
                                      marginBottom: 4,
                                    }}>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }}>
                                      Title:{' '}
                                    </Text>
                                    {accomplishment.title || 'N/A'}
                                  </Text>
                                ) : null}

                                {/* Show URL with a clickable link */}
                                {accomplishment.url && (
                                  <Text
                                    style={styles.OutputAccomplishmentText}
                                    onPress={() =>
                                      handleLinkPress(accomplishment.url)
                                    }>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }}>
                                      Link:{' '}
                                    </Text>
                                    <Text style={{color: colors.secondary}}>
                                      {accomplishment.url}
                                    </Text>
                                  </Text>
                                )}

                                {/* View More Button */}
                                <TouchableOpacity
                                  onPress={() =>
                                    openAccomplishmentModal(accomplishment)
                                  }
                                  style={{
                                    paddingVertical: 8,
                                    borderRadius: 4,
                                    marginTop: 10,
                                    alignSelf: 'flex-start',
                                  }}>
                                  <Text
                                    style={{
                                      color: colors.secondary,
                                      fontWeight: 'bold',
                                    }}>
                                    View More
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ),
                          )}
                        </View>
                      </ScrollView>
                    </View>
                  ))}
                </ScrollView>
              ) : null}

              {/* Modal for More Information */}
              <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
                transparent={true}>
                <View style={styles.modalAccomContainer}>
                  <View style={styles.modalAccomContent}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}>
                      {selectedAccomplishment &&
                      selectedAccomplishment.title ? (
                        <Text style={styles.OutputText}>
                          <Text style={{fontWeight: 'bold', color: 'black'}}>
                            Title:{' '}
                          </Text>
                          {selectedAccomplishment.title}
                        </Text>
                      ) : null}

                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeModal}>
                        <Ionicons name="close" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                    {selectedAccomplishment && (
                      <>
                        {selectedAccomplishment.description ? (
                          <View style={{marginBottom: 4}}>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>
                              Description:
                            </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedAccomplishment.description}
                            </Text>
                          </View>
                        ) : null}

                        {selectedAccomplishment.issued_date ? (
                          <Text style={styles.OutputText}>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>
                              Issued Date:{' '}
                            </Text>
                            {moment(selectedAccomplishment.issued_date).format(
                              'D MMM YY',
                            )}
                          </Text>
                        ) : null}

                        {selectedAccomplishment.published_date ? (
                          <Text style={styles.OutputText}>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>
                              Published Date:{' '}
                            </Text>
                            {moment(
                              selectedAccomplishment.published_date,
                            ).format('D MMM YY')}
                          </Text>
                        ) : null}

                        {/* Conditionally render URL with clickable link */}
                        {selectedAccomplishment.url ? (
                          <Text
                            style={styles.OutputlinkText}
                            onPress={() =>
                              Linking.openURL(selectedAccomplishment.url)
                            }>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>
                              Link:{' '}
                            </Text>
                            <Text style={{color: 'blue'}}>
                              {selectedAccomplishment.url}
                            </Text>
                          </Text>
                        ) : null}
                      </>
                    )}
                  </View>
                </View>
              </Modal>
            </View>

            {user?.profileSummary && (
              <View style={styles.detailText}>
                <Text style={styles.boldText}>Profile Summary: </Text>
                <Text style={styles.OutputText}>{user?.profileSummary}</Text>
              </View>
            )}
            {user?.certifications && (
              <View style={styles.detailText}>
                <Text style={styles.boldText}>Certifications: </Text>
                <Text style={styles.OutputText}>
                  {user?.certifications?.join(', ')}
                </Text>
              </View>
            )}
            {user?.selectedCandidate?.achievements && (
              <View style={styles.detailText}>
                <Text style={styles.boldText}>Achievements: </Text>
                <Text style={styles.OutputText}>
                  {' '}
                  {user?.selectedCandidate?.achievements?.join(', ')}
                </Text>
              </View>
            )}
          </ScrollView>
        );
      case 'Professional':
        return (
          <View>
            <ScrollView
              // contentContainerStyle={}
              showsVerticalScrollIndicator={false}>
              {/* Project Details Section */}
              <Text style={styles.boldText}>Project Details</Text>
              {user?.project_details?.length > 0 ? (
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.scrollContainer}
                  showsHorizontalScrollIndicator={false}>
                  {user?.project_details?.map((pro, index) => (
                    <View key={`pro_${index}`} style={styles.projectCard}>
                      {pro.title && (
                        <Text style={styles.titleText}>Title: {pro.title}</Text>
                      )}

                      {pro.role && (
                        <Text style={styles.roleText}>Role: {pro.role}</Text>
                      )}

                      {pro.worked_duration?.from &&
                        pro.worked_duration?.till && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Ionicons name="time" size={16} color="gray" />
                            <Text
                              style={[styles.durationText, {marginLeft: 8}]}>
                              {moment(pro.worked_duration.from).format(
                                'D MMM YY',
                              )}{' '}
                              -{' '}
                              {moment(pro.worked_duration.till).format(
                                'D MMM YY',
                              )}
                            </Text>
                          </View>
                        )}

                      <TouchableOpacity onPress={() => openModal(pro)}>
                        <Text style={styles.viewMoreText}>View More</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noDataText}>
                  No project records available.
                </Text>
              )}

              {/* Modal for showing full project details */}
              {selectedProject && (
                <Modal
                  visible={isModalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={toggleModal}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View
                        style={{
                          marginHorizontal: 0,
                          flexDirection: 'column',
                        }}>
                        {/* Title and Close Icon in the Same Row */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          {selectedProject.title && (
                            <Text style={styles.modalTitle}>
                              <Text style={{color: 'black'}}>Title: </Text>
                              <Text style={{color: 'black'}}>
                                {selectedProject.title}
                              </Text>
                            </Text>
                          )}
                          <TouchableOpacity
                            style={styles.closeButton}
                            onPress={toggleModal}>
                            <Ionicons name="close" size={22} color="red" />
                          </TouchableOpacity>
                        </View>

                        {selectedProject.nature_of_employment && (
                          <Text
                            style={{
                              color: 'green',
                              fontWeight: 'bold',
                            }}>
                            {selectedProject.nature_of_employment}
                          </Text>
                        )}
                      </View>

                      <ScrollView
                        contentContainerStyle={styles.modalDetailsContainer}>
                        {selectedProject.role && (
                          <Text style={styles.modalText}>
                            <Text style={{color: 'black'}}>Role: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedProject.role}
                            </Text>
                          </Text>
                        )}

                        {selectedProject.description && (
                          <Text style={styles.modalText}>
                            <Text style={{color: 'black'}}>Description: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedProject.description}
                            </Text>
                          </Text>
                        )}

                        {/* Skills Used */}
                        {Array.isArray(selectedProject.skills_used) &&
                          selectedProject.skills_used.length > 0 && (
                            <View>
                              <Text style={{color: 'black', marginBottom: 4}}>
                                Skills:
                              </Text>

                              <View style={styles.chipContainer}>
                                {selectedProject.skills_used.map(
                                  (skill, index) => (
                                    <Text key={index} style={styles.chip}>
                                      {skill}
                                    </Text>
                                  ),
                                )}
                              </View>
                            </View>
                          )}

                        {/* Other project details */}
                        {selectedProject.client && (
                          <Text style={styles.modalText}>
                            <Text style={{color: 'black'}}>Client: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedProject.client}
                            </Text>
                          </Text>
                        )}
                        {selectedProject.status && (
                          <Text style={styles.modalText}>
                            <Text style={{color: 'black'}}>Status: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedProject.status}
                            </Text>
                          </Text>
                        )}
                        {selectedProject.project_location && (
                          <Text style={styles.modalText}>
                            <Text style={{color: 'black'}}>
                              Project Location:{' '}
                            </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedProject.project_location}
                            </Text>
                          </Text>
                        )}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
              )}
            </ScrollView>

            <View>
              <Text style={styles.sectionTitle}>Employment Details</Text>

              {user?.employment_details &&
              user?.employment_details.length > 0 ? (
                user?.employment_details.map((employment, index) => (
                  <View key={index} style={styles.Employmentcard}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: 4,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.companyName}>
                        {employment.company_name || 'N/A'}
                      </Text>
                      <Text style={styles.employmentType}>
                        {employment.employment_type || 'N/A'}
                      </Text>
                    </View>

                    <Text style={styles.jobTitle}>
                      {employment.job_title || 'N/A'}
                    </Text>

                    {/* Dates */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                      {employment.joining_date || employment.leaving_date ? (
                        <>
                          <Ionicons name="calendar" size={16} color="gray" />
                          <Text style={styles.date}>
                            {employment.joining_date
                              ? moment(employment.joining_date).format(
                                  'D MMM YY',
                                )
                              : ''}
                            {employment.joining_date && employment.leaving_date
                              ? ' - '
                              : ''}
                            {employment.leaving_date
                              ? moment(employment.leaving_date).format(
                                  'D MMM YY',
                                )
                              : employment.joining_date
                              ? 'Present'
                              : ''}
                          </Text>
                        </>
                      ) : null}
                    </View>

                    {/* View More Button */}
                    <TouchableOpacity
                      style={styles.viewMoreButton}
                      onPress={() => openEmploymentModal(employment)}>
                      <Text style={styles.viewMoreText}>View More</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>
                  No employment details available.
                </Text>
              )}

              {/* Modal for Detailed Employment Data */}
              {selectedEmployment && (
                <Modal
                  visible={isEmploymentModalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={closeEmploymentModal}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                          {selectedEmployment.company_name || 'Details'}
                        </Text>
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={closeEmploymentModal}>
                          <Ionicons name="close" size={24} color="red" />
                        </TouchableOpacity>
                      </View>

                      <ScrollView contentContainerStyle={styles.modalDetails}>
                        {/* Display all fields */}
                        {selectedEmployment.role && (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Role: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedEmployment.role}
                            </Text>
                          </Text>
                        )}

                        {selectedEmployment.job_title && (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Job Title: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedEmployment.job_title}
                            </Text>
                          </Text>
                        )}

                        {selectedEmployment.employment_type && (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Employment Type: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedEmployment.employment_type}
                            </Text>
                          </Text>
                        )}

                        {selectedEmployment.location && (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Location: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedEmployment.location}
                            </Text>
                          </Text>
                        )}
                        {selectedEmployment.joining_date && (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Joining Date: </Text>
                            <Text style={{color: 'gray'}}>
                              {moment(selectedEmployment.joining_date).format(
                                'D MMM YYYY',
                              )}
                            </Text>
                          </Text>
                        )}

                        {selectedEmployment.leaving_date ? (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Leaving Date: </Text>
                            <Text style={{color: 'gray'}}>
                              {moment(selectedEmployment.leaving_date).format(
                                'D MMM YYYY',
                              )}
                            </Text>
                          </Text>
                        ) : selectedEmployment.joining_date ? (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Leaving Date: </Text>
                            <Text style={{color: 'gray'}}>{'- Present'}</Text>
                          </Text>
                        ) : null}

                        {selectedEmployment.notice_period && (
                          <Text style={styles.detail}>
                            <Text style={styles.label}>Notice Period: </Text>
                            <Text style={{color: 'gray'}}>
                              {selectedEmployment.notice_period}
                            </Text>
                          </Text>
                        )}

                        {selectedEmployment.skills &&
                          selectedEmployment.skills.length > 0 && (
                            <View>
                              <Text style={[styles.label, {marginBottom: 8}]}>
                                Skills:
                              </Text>
                              <View style={styles.chipContainer}>
                                {selectedEmployment.skills.map((skill, idx) => (
                                  <Text key={idx} style={styles.chip}>
                                    {skill}
                                  </Text>
                                ))}
                              </View>
                            </View>
                          )}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          </View>
        );

      case 'Review':
        return (
          <ScrollView contentContainerStyle={{paddingBottom: 20}}>
            <ReviewPage data={data} />
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Details</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-aound',
          marginTop: 12,
        }}>
        {showButtons && (
          <>
            <TouchableOpacity
              style={[
                styles.shortlistButton,
                {backgroundColor: isShortlisted ? '#f8d7da' : '#d4edda'},
              ]}
              onPress={handleToggle}>
              <Text
                style={{
                  color: isShortlisted ? '#155724' : '#28a745',
                }}>
                {isShortlisted ? 'Unshortlist' : 'Shortlist'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shortlistButton, {backgroundColor: '#ffe0cc'}]}
              // onPress={handleReject}
            >
              <Text style={{color: '#ff6600'}}>Cover Letter</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, marginBottom: 80}}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fafafa',
            padding: 12,
            marginTop: 8,
            paddingVertical: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                marginHorizontal: 12,
              }}>
              <Text style={styles.NameText}>
                {user?.first_name && user?.last_name
                  ? `${user?.first_name} ${user?.last_name}`
                  : 'Candidate Name'}
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: dotColor,
                    marginRight: 4,
                  }}
                />
                {/* Status Text */}
                <Text style={[styles.statusText, {color: statusColor}]}>
                  {onlineStatus}
                </Text>
              </View>
              <Text style={styles.OutputText}>
                {getFormattedNoticePeriod(
                  user?.career_preferences?.[0]?.notice_period,
                ) || 'N/A'}
              </Text>
            </View>
            <Image
              source={
                user?.profile_photo
                  ? {uri: BASE_URL + user?.profile_photo}
                  : require('../../Assets/Images/Userimage.png')
              }
              style={styles.profileimage}
            />
          </View>
          <View style={{flexDirection: 'row', paddingRight: 4}}>
            <View style={{flex: 1}}>
              <View style={styles.workchipsContainer}>
                {data.user.work_availability.map(item => (
                  <TouchableOpacity
                    key={item.mode}
                    style={[
                      styles.workchip,
                      selectedMode === item.mode && styles.selectedChip,
                    ]}
                    onPress={() => handleChipClick(item.mode)}>
                    <Text style={styles.chipText}>{item.mode}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedMode && (
                <View style={styles.slotsContainer}>
                  <Text style={styles.slotsTitle}>
                    Slots for {selectedMode}:
                  </Text>
                  {getSlots(selectedMode).map((slot, index) => (
                    <View key={index} style={styles.slotItem}>
                      <Ionicons name="time" size={14} color="gray" />
                      <Text style={styles.slotText}>
                        {slot.start_time} - {slot.end_time}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 12,
                justifyContent: 'flex-end',
              }}>
              <Ionicons
                name="mail"
                size={20}
                color={colors.secondary}
                style={{
                  marginRight: 12,
                  backgroundColor: '#e6f7ff', // Circle background color
                  borderRadius: 30, // Make it circular
                  width: 32, // Circle diameter (adjust as needed)
                  height: 32, // Circle diameter (adjust as needed)
                  justifyContent: 'center', // Center the icon inside the circle
                  alignItems: 'center', // Center the icon inside the circle
                  padding: 6,
                }}
                onPress={() => Linking.openURL(`mailto:${data.user.email}`)}
              />

              <Ionicons
                name="call"
                size={20}
                color={colors.secondary}
                style={{
                  backgroundColor: '#e6f7ff',
                  borderRadius: 30,
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 6,
                }}
                onPress={() => Linking.openURL(`tel:${user.mobile_number}`)}
              />
            </View>
          </View>
        </View>
        {/* Experience Text */}
        <View style={{marginTop: 6}}>
          {experienceText && (
            <View style={styles.experienceContainer}>
              <Text style={styles.applicationExperienceText}>
                {experienceText}
              </Text>
            </View>
          )}
          <View
            style={[styles.salaryAndDateContainer, styles.oddSalarysection]}>
            {data?.user?.career_preferences?.[0]?.total_exp ? (
              <View style={styles.totalExp}>
                <Ionicons name="briefcase" size={14} color="gray" />
                <Text style={styles.applicationExpText}>
                  {data?.user?.career_preferences?.[0]?.total_exp} years
                </Text>
              </View>
            ) : null}

            {data?.user?.career_preferences?.[0]?.annual_salary?.amount ? (
              <View style={styles.iconTextSalaryContainer}>
                <Ionicons name="cash" size={14} color="gray" />
                <Text style={styles.salaryText}>
                  {data?.user?.career_preferences?.[0]?.annual_salary
                    ?.currency === 'INR'
                    ? `₹ ${formatAmount(
                        data?.user?.career_preferences?.[0]?.annual_salary
                          ?.amount,
                      )}`
                    : `${
                        data?.user?.career_preferences?.[0]?.annual_salary
                          ?.currency
                      } ${formatAmount(
                        data?.user?.career_preferences?.[0]?.annual_salary
                          ?.amount,
                      )}`}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.locationContainer}>
            {data?.user?.career_preferences?.[0]?.city && (
              <View style={styles.locationItem}>
                <Ionicons name="location" size={14} color="gray" />
                <Text style={styles.applicationLocationText}>
                  {data?.user?.career_preferences?.[0]?.city}
                </Text>

                {Array.isArray(
                  data?.user?.career_preferences?.[0]?.pref_locations,
                ) &&
                  data?.user?.career_preferences?.[0]?.pref_locations.length >
                    0 && (
                    <Text style={styles.applicationPrefLocationText}>
                      {' ('}
                      {data?.user?.career_preferences?.[0]?.pref_locations.join(
                        ', ',
                      )}
                      {')'}
                    </Text>
                  )}
              </View>
            )}
          </View>
        </View>

        <View style={{marginTop: 12, paddingVertical: 4}}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'Profile Details' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Profile Details')}>
              <Text style={styles.tabText}>Profile Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'Professional' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Professional')}>
              <Text style={styles.tabText}>Professional</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'Review' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Review')}>
              <Text style={styles.tabText}>Review</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>{renderTabs()}</View>
        </View>
      </ScrollView>

      {showButtons && (
        <>
          <View style={styles.fixedButtonContainer}>
            {page === 'job_invitation' ? (
              <TouchableOpacity
                style={styles.fixedButton}
                onPress={handleSendInvitation} // Call the handler here
              >
                <Text style={styles.buttonText}>Send Invitation</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                // style={styles.fixedButton}
                onPress={handleApplicationStatus} // Call the handler here
              >
                {data?.status === 'APPLICATION VIEWED' ? (
                  <View style={styles.buttonStatusContainer}>
                    <TouchableOpacity
                      style={[styles.acceptButton, styles.Statusbutton]}
                      onPress={() => handleApplicationStatus()}>
                      <Text style={styles.AcceptbuttonText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.rejectButton, styles.Statusbutton]}
                      onPress={() => {
                        context = {
                          status: 'REJECTED',
                          message: 'Application has been rejected',
                        };
                        dispatch(
                          ApplicationJobStatus(data?.id, context, data?.job),
                        );
                      }}>
                      <Text style={styles.RejectbuttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.fixedButton,
                      {
                        backgroundColor: buttonBackgroundColor,
                      },
                    ]}
                    onPress={() => {
                      handleApplicationStatus();
                      setButtonPressed(true);
                    }}>
                    <Text style={{color: buttonTextColor}}>
                      {data?.status === 'ACCEPTED'
                        ? 'Schedule Interview'
                        : data?.status === 'INTERVIEW'
                        ? 'Hired Candidate'
                        : data?.status === 'REJECTED'
                        ? 'Application Rejected'
                        : 'Candidate Selected'}
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  title: {
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 18,
  },

  shortlistButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  detailText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  boldText: {
    width: width * 0.4,
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 8,
  },
  boldTextAccomplishment: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
    marginTop: 12,
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
  statusText: {
    fontSize: 13,
  },
  NameText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 16,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
    width: '100%',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    color: colors.blackText,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 4,
  },
  tabText: {
    color: '#333',
  },
  OutputText: {
    width: width * 0.7,
    fontWeight: '600',
    color: 'gray',
    fontSize: 13,
  },
  OutputlinkText: {
    width: width * 0.8,
    fontWeight: '600',
    color: 'gray',
    fontSize: 13,
  },
  OutputAccomplishmentText: {
    width: width * 0.7,
    color: 'gray',
    fontSize: 13,
  },
  contentContainer: {
    marginHorizontal: 12,
    marginTop: 20,
  },
  OutputTextWork: {
    width: width * 0.7,
    color: 'gray',
    fontSize: 13,
  },

  profileimage: {
    padding: 12,
    width: 56,
    height: 56,
    borderRadius: 50,
  },

  salaryAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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

  applicationExperienceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#004466',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 12,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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

  oddSalarysection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginTop: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  fixedButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Statusbutton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  acceptButton: {
    backgroundColor: '#d4edda',
  },
  AcceptbuttonText: {
    color: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#f8d7da',
  },
  RejectbuttonText: {
    color: '#dc3545',
  },

  projectCard: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    width: width * 0.7,
    marginRight: 16,
    marginBottom: 8,
  },
  roleText: {
    color: 'gray',
  },
  titleText: {
    color: 'black',
    fontWeight: '12',
  },
  durationText: {
    color: 'gray',
    fontSize: 12,
  },

  viewMoreText: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 8,
  },
  noDataText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },

  closeButton: {
    alignSelf: 'flex-end',
    borderRadius: 50,
    padding: 2,
  },

  modalDetailsContainer: {
    marginTop: 8,
  },

  modalText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  Employmentcard: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    width: width * 0.9,
    marginVertical: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  jobTitle: {
    fontSize: 12,
    color: 'gray',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  employmentType: {
    fontSize: 12,
    color: '#28a745',
    marginBottom: 4,
    backgroundColor: '#d4edda',
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 4,
  },

  modalAccomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    paddingHorizontal: 20,
  },
  modalAccomContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '90%',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  modalDetails: {
    paddingBottom: 16,
  },
  detail: {
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },

  workchipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensure chips don't overflow and wrap if needed
    marginBottom: 20,
    marginTop: 12,
  },
  workchip: {
    backgroundColor: '#ffebe6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    fontSize: 12,
    color: 'white',
    marginHorizontal: 5,
  },
  selectedChip: {
    backgroundColor: 'orange',
  },
  chipText: {
    color: 'black',
    fontSize: 14,
  },
  slotsContainer: {
    paddingHorizontal: 8,
  },
  slotsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotText: {
    marginLeft: 4,
    fontSize: 12,
  },
});

export default UserDetailScreen;
