import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../Services/baseAPI';
import moment from 'moment';
import {colors} from '../Global_CSS/TheamColors';
const {width} = Dimensions.get('window');

const InvitationDetailModal = ({isVisible, onClose, data}) => {
  const [modalHeight] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('personal');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEmploymentModalVisible, setEmploymentModalVisible] = useState(false);
  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(modalHeight, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, modalHeight]);

  const getOnlineStatus = (isOnline, lastSeen) => {
    if (isOnline) {
      return {
        onlineStatus: 'Currently Online',
        statusColor: 'gray',
        dotColor: '#28a745',
      };
    }

    const lastSeenTime = lastSeen
      ? `Last seen: ${moment(lastSeen).format('Do MMM YY, h:mm a')}`
      : 'Offline';

    return {
      onlineStatus: lastSeenTime,
      statusColor: 'gray',
      dotColor: '#ff0000',
    };
  };

  const {onlineStatus, statusColor, dotColor} = getOnlineStatus(
    data?.is_online,
    data?.last_seen,
  );

  const formatDate = date => {
    if (date) {
      return moment(date).isValid() ? moment(date).format('D MMM YY') : '';
    }
    return '';
  };

  const openEmploymentModal = employment => {
    setSelectedEmployment(employment);
    setEmploymentModalVisible(true);
  };

  const closeEmploymentModal = () => {
    setEmploymentModalVisible(false);
  };

  const groupAccomplishmentsByName = accomplishments => {
    return accomplishments.reduce((groups, accomplishment) => {
      const name = accomplishment.name || null; // If name is not available, set it to null
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(accomplishment);
      return groups;
    }, {});
  };

  const groupedAccomplishments = groupAccomplishmentsByName(
    data?.user?.accomplishments || [],
  );

  const openAccomplishmentModal = accomplishment => {
    setSelectedAccomplishment(accomplishment);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAccomplishment(null);
  };

  console.log('.................', JSON.stringify(data, null, 2));

  // Function to render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <View>
            {/* Personal Information */}
            <View style={{paddingVertical: 4}}>
              <View style={styles.evensection}>
                <Text style={styles.boldText}>Email</Text>
                <Text style={styles.emailText}>
                  {data?.user?.email || 'N/A'}
                </Text>
              </View>
              <View style={styles.oddsection}>
                <Text style={styles.boldText}>Phone Number</Text>
                <Text style={styles.mobilenumber}>
                  {data?.user?.mobile_number || 'N/A'}
                </Text>
              </View>
              <View style={styles.evensection}>
                <Text style={styles.boldText}>Experience </Text>
                <Text style={styles.OutputText}>
                  {data?.user?.career_preferences?.[0]?.total_exp || 'N/A'}{' '}
                  years
                </Text>
              </View>
              <View style={styles.oddsection}>
                <Text style={styles.boldText}>Address </Text>
                <Text style={styles.OutputText}>
                  {`${data?.user?.career_preferences?.[0]?.city}`}
                </Text>
              </View>
              <View style={styles.evensection}>
                <Text style={styles.boldText}>Notice period</Text>
                <Text style={styles.emailText}>
                  {data?.user?.career_preferences?.[0]?.notice_period || 'N/A'}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 12,
                }}>
                <Text style={[styles.boldText, {marginBottom: 12}]}>
                  Skills
                </Text>
                <View style={styles.chipContainer}>
                  {data?.user?.key_skills?.length > 0 ? (
                    data?.user?.key_skills?.map((skill, index) => (
                      <Text key={index} style={styles.chip}>
                        {skill}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.OutputText}>No skills available</Text>
                  )}
                </View>
              </View>

              <View style={{paddingVertical: 12, paddingHorizontal: 8}}>
                {data?.user?.it_skills?.length > 0 && ( // Only render if there are IT skills
                  <>
                    <Text style={[styles.boldText, {marginBottom: 12}]}>
                      IT Skills & Experience
                    </Text>
                    <ScrollView
                      contentContainerStyle={{
                        flexDirection: 'column',
                        gap: 8,
                      }}>
                      {data?.user?.it_skills.map((skill, index) => (
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
                      ))}
                    </ScrollView>
                  </>
                )}
              </View>

              <View style={{paddingVertical: 12, paddingHorizontal: 8}}>
                {data?.user?.higher_edu?.length > 0 && (
                  <>
                    <Text style={[styles.boldText, {marginBottom: 12}]}>
                      Education
                    </Text>
                    <ScrollView
                      contentContainerStyle={{
                        flexDirection: 'column',
                        gap: 8,
                      }}>
                      {data?.user?.higher_edu.map((edu, index) => (
                        <View
                          key={`edu_${index}`}
                          style={[
                            styles.section,
                            {
                              padding: 12,
                              borderRadius: 8,
                              backgroundColor: '#f1f1f1',
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
                                  {' ('}
                                  {edu.duration?.start_year || ''}
                                  {' - '}
                                  {edu.duration?.end_year || ''}
                                  {')'}
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
                  </>
                )}
              </View>

              <View style={{paddingVertical: 12, paddingHorizontal: 8}}>
                {data?.user?.languages?.length > 0 ? (
                  <>
                    <Text style={[styles.boldText, {marginBottom: 12}]}>
                      Languages
                    </Text>
                    <View
                      style={{
                        flexDirection: 'column',
                        gap: 12,
                      }}>
                      {data?.user?.languages?.map((language, index) => (
                        <View
                          key={`language_${index}`}
                          style={[
                            styles.section,
                            {
                              paddingVertical: 12,
                              paddingHorizontal: 12,
                              backgroundColor: '#f1f1f1',
                              borderRadius: 8,
                              height: 'auto',
                              flex: 1,
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

              {data?.user?.profileSummary && (
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Profile Summary: </Text>
                  <Text style={styles.OutputText}>
                    {data?.user?.profileSummary}
                  </Text>
                </View>
              )}
              {data?.user?.certifications && (
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Certifications: </Text>
                  <Text style={styles.OutputText}>
                    {data?.user?.certifications?.join(', ')}
                  </Text>
                </View>
              )}
              {data?.user?.selectedCandidate?.achievements && (
                <View style={styles.detailText}>
                  <Text style={styles.boldText}>Achievements: </Text>
                  <Text style={styles.OutputText}>
                    {' '}
                    {data?.user?.selectedCandidate?.achievements?.join(', ')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'professional':
        return (
          <View>
            {/* Project Information */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Only render "Project Details" if there are project details */}
              {data?.user?.project_details?.length > 0 && (
                <>
                  <Text style={[styles.boldText, {marginBottom: 12}]}>
                    Project Details
                  </Text>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}>
                    {data?.user?.project_details?.map((pro, index) => (
                      <View key={`pro_${index}`} style={styles.projectCard}>
                        {/* Only render these if they have data */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 8, // Added margin to create space between title and role
                          }}>
                          {pro.title && (
                            <Text style={styles.titleText}>
                              Title: {pro.title}
                            </Text>
                          )}

                          {pro.nature_of_employment && (
                            <Text style={{color: 'green', fontWeight: 'bold'}}>
                              {pro.nature_of_employment}
                            </Text>
                          )}
                        </View>

                        {pro.role && (
                          <Text style={styles.roleText}>Role: {pro.role}</Text>
                        )}

                        {pro.description && (
                          <Text style={styles.modalText}>
                            <Text style={{color: 'black'}}>Description: </Text>
                            <Text style={{color: 'gray'}}>
                              {pro.description}
                            </Text>
                          </Text>
                        )}

                        {/* Conditionally render skills used */}
                        {Array.isArray(pro.skills_used) &&
                          pro.skills_used.length > 0 && (
                            <View style={styles.chipContainer}>
                              {pro.skills_used.map((skill, index) => (
                                <Text key={index} style={styles.chip}>
                                  {skill}
                                </Text>
                              ))}
                            </View>
                          )}

                        {/* Conditionally render client */}
                        {pro.client && (
                          <Text style={styles.modalText}>
                            <Text style={{color: 'black'}}>Client: </Text>
                            <Text style={{color: 'gray'}}>{pro.client}</Text>
                          </Text>
                        )}

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 8, // Margin to create space between duration and status
                          }}>
                          {pro.worked_duration?.from &&
                            pro.worked_duration?.till && (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Ionicons name="time" size={16} color="gray" />
                                <Text
                                  style={[
                                    styles.durationText,
                                    {marginLeft: 2},
                                  ]}>
                                  {formatDate(pro.worked_duration.from)} -{' '}
                                  {formatDate(pro.worked_duration.till)}
                                </Text>
                              </View>
                            )}

                          {pro.status && (
                            <Text
                              style={[styles.modalText, {marginLeft: 'auto'}]}>
                              <Text style={{color: 'orange'}}>
                                {pro.status}
                              </Text>
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}
            </ScrollView>

            <View>
              {data?.user?.employment_details &&
              data?.user?.employment_details.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>Employment Details</Text>

                  {data?.user?.employment_details.map((employment, index) => (
                    <View key={index} style={styles.Employmentcard}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {employment.company_name && (
                          <Text style={styles.companyName}>
                            {employment.company_name}
                          </Text>
                        )}

                        {employment.employment_type && (
                          <Text style={styles.employmentType}>
                            {employment.employment_type}
                          </Text>
                        )}
                      </View>

                      {employment.job_title && (
                        <Text style={styles.jobTitle}>
                          {employment.job_title}
                        </Text>
                      )}

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
                                ? moment(
                                    employment.joining_date,
                                    'DD-MM-YYYY',
                                    true,
                                  ).format('D MMM YY')
                                : ''}

                              {employment.joining_date &&
                              employment.leaving_date
                                ? ' - '
                                : ''}

                              {employment.leaving_date
                                ? moment(
                                    employment.leaving_date,
                                    'DD-MM-YYYY',
                                    true,
                                  ).format('D MMM YY')
                                : employment.joining_date
                                ? ' - Present'
                                : ''}
                            </Text>
                          </>
                        ) : null}
                      </View>

                      <TouchableOpacity
                        onPress={() => openEmploymentModal(employment)}>
                        <Text style={styles.viewMoreText}>View More</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              ) : null}

              {selectedEmployment && isEmploymentModalVisible && (
                <Modal
                  visible={isEmploymentModalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={closeEmploymentModal}>
                  <View style={styles.modalEmploymentContainer}>
                    <View style={styles.modalEmploymentContent}>
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

            <View>
              {data?.user?.accomplishments &&
              data?.user?.accomplishments.length > 0 ? (
                <>
                  <Text style={styles.boldTextAccomplishment}>
                    Accomplishments:
                  </Text>
                  <ScrollView
                    contentContainerStyle={{flexDirection: 'column', gap: 2}}
                    showsVerticalScrollIndicator={false}>
                    {Object.keys(groupedAccomplishments).map((name, index) => (
                      <View
                        key={`accomplishment_group_${index}`}
                        style={{marginBottom: 8}}>
                        {name && <Text style={styles.boldText}>{name}</Text>}

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
                                  {accomplishment.name && (
                                    <Text
                                      style={{
                                        color: colors.primary,
                                        fontWeight: 'bold',
                                        marginBottom: 4,
                                      }}>
                                      {accomplishment.name}
                                    </Text>
                                  )}

                                  {/* Show Title if present */}
                                  {accomplishment.title && (
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
                                      {accomplishment.title}
                                    </Text>
                                  )}

                                  {/* Show URL with clickable link if present */}
                                  {accomplishment.url && (
                                    <Text
                                      style={styles.OutputAccomplishmentText}
                                      onPress={() =>
                                        Linking.openURL(accomplishment.url)
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
                </>
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
                      {selectedAccomplishment?.title && (
                        <Text style={styles.OutputAccomplishmentText}>
                          <Text style={{fontWeight: 'bold', color: 'black'}}>
                            Title:{' '}
                          </Text>
                          {selectedAccomplishment.title}
                        </Text>
                      )}

                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeModal}>
                        <Ionicons name="close" size={24} color="red" />
                      </TouchableOpacity>
                    </View>

                    {selectedAccomplishment?.description && (
                      <View style={{marginBottom: 4}}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>
                          Description:
                        </Text>
                        <Text style={{color: 'gray'}}>
                          {selectedAccomplishment.description}
                        </Text>
                      </View>
                    )}

                    {selectedAccomplishment?.issued_date && (
                      <Text style={styles.OutputText}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>
                          Issued Date:{' '}
                        </Text>
                        {moment(selectedAccomplishment.issued_date).format(
                          'D MMM YY',
                        )}
                      </Text>
                    )}

                    {selectedAccomplishment?.published_date && (
                      <Text style={styles.OutputText}>
                        <Text style={{fontWeight: 'bold', color: 'black'}}>
                          Published Date:{' '}
                        </Text>
                        {moment(selectedAccomplishment.published_date).format(
                          'D MMM YY',
                        )}
                      </Text>
                    )}

                    {selectedAccomplishment?.url && (
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
                    )}
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        );

      default:
        return <Text>No content available for this tab</Text>;
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />

      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [
              {
                translateY: modalHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.header}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            {/* Image on the left */}
            <Image
              source={
                data?.profile_photo
                  ? {uri: BASE_URL + data?.profile_photo}
                  : require('../Assets/Images/Userimage.png')
              }
              style={styles.profileimage}
            />

            {/* Name and status in column, icons on the right in the row */}
            <View style={{marginLeft: 10, flex: 1}}>
              {/* Row for name and icons */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {/* Name on the left */}
                <Text style={styles.userName}>
                  {data?.user?.first_name || 'N/A'}{' '}
                  {data?.user?.last_name || 'N/A'}
                </Text>

                {/* Icons aligned to the right */}
                <View style={{flexDirection: 'row',marginHorizontal:12}}>
                  <TouchableOpacity style={{marginRight:12}}>
                    <Ionicons name="bookmark-outline" size={24} color="#004466" />
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Ionicons name="heart-outline" size={24} color="#004466" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Status text in column below name */}
              <Text style={[styles.statusText, {color: statusColor}]}>
                {onlineStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs: Personal Info & Professional Info */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
            onPress={() => setActiveTab('personal')}>
            <Text style={styles.tabText}>Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'professional' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('professional')}>
            <Text style={styles.tabText}>Professional Information</Text>
          </TouchableOpacity>
        </View>

        {/* Render the content dynamically based on active tab */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderTabContent()}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileimage: {
    padding: 12,
    width: 48,
    height: 48,
    borderRadius: 50,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 13,
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#004466',
  },
  tabText: {
    fontSize: 14,
    color: '#004466',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  accomplishmentContainer: {
    marginBottom: 15,
  },
  evensection: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  oddsection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  boldText: {
    width: width * 0.35,
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 13,
  },
  detailText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
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
  projectCard: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    width: width * 0.75,
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
  modalEmploymentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalEmploymentContent: {
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
  closeButton: {
    alignSelf: 'flex-end',
    borderRadius: 50,
    padding: 2,
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
  OutputAccomplishmentText: {
    width: width * 0.7,
    color: 'gray',
    fontSize: 13,
  },
});

export default InvitationDetailModal;
