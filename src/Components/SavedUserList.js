// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';

// const {width} = Dimensions.get('window'); // Get the screen width

// const SavedUserList = () => {
//   return (
//     <View style={styles.container}>
     
//       <Text>Hello</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: colors.background,
//     padding: 12,
//   },
// });

// export default SavedUserList;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobViewController from '../Redux/Action/JobViewController';
import { colors } from '../Global_CSS/TheamColors';
import { BASE_URL } from '../Services/baseAPI';
const {width} = Dimensions.get('window'); // Get the screen width

const SavedJobScreen = () => {
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const {GetSavedJobs, ToggleSaveJob} = JobViewController();
  const {SavedJobs} = useSelector(state => state.job);
  const isFocus = useIsFocused();
  const navigation = useNavigation();

  console.log('********************',GetSavedJobs);
  

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data'); // Wait for the value to be retrieved
        setId(id);
        dispatch(GetSavedJobs(id));
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, [isFocus]);

 
  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.cardContainer}>
        {Array.isArray(SavedJobs?.saved_jobs) &&
        SavedJobs.saved_jobs.length > 0 ? (
          SavedJobs.saved_jobs.map(savedJob => (
            <TouchableOpacity key={savedJob.job.id} style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.innerContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('JobDetailScreen', {
                        job_id: savedJob.job.id,
                      })
                    }>
                    <View style={styles.jobTitleContainer}>
                      {savedJob?.job?.job_title?.title && (
                        <Text style={styles.cardTitle}>
                          {savedJob.job.job_title.title}
                        </Text>
                      )}
                      <View style={styles.detailsRow}>
                        <Ionicons
                          name="location"
                          size={14}
                          color={colors.primary}
                        />
                        {savedJob?.job?.job_location &&
                          savedJob.job.job_location.length > 0 && (
                            <Text style={styles.detailsText}>
                              {savedJob.job.job_location.join(', ')}
                            </Text>
                          )}
                      </View>
                      <View style={styles.containerData}>
                        <View style={styles.detailsRow}>
                          <Ionicons
                            name="briefcase"
                            size={14}
                            color={colors.primary}
                          />
                          {savedJob?.job?.experience_level && (
                            <Text style={styles.detailsText}>
                              {`${
                                savedJob.job.experience_level.minYear || 0
                              } - ${
                                savedJob.job.experience_level.maxYear || 0
                              } years`}
                            </Text>
                          )}
                        </View>
                        <View style={styles.detailsalary}>
                          <Ionicons
                            name="cash"
                            size={14}
                            color={colors.primary}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <CustomFormatAmount
                              amount={savedJob?.job?.salary?.yearly?.min || 0}
                            />
                            <Text style={{color: colors.primary}}> - </Text>
                            <CustomFormatAmount
                              amount={savedJob?.job?.salary?.yearly?.max || 0}
                            />
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: 'gray',
                              }}>
                              {savedJob?.job?.salary?.yearly?.currency || 'N/A'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleBookmark(savedJob.job.id)}
                    style={styles.bookmarkIconContainer}>
                    <Ionicons
                      name={
                        isBookmarked(savedJob?.job?.id)
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }
                      size={22}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.innerCard}>
                  <View style={styles.iconMain}>
                    {savedJob?.job?.company.logo ? (
                      <Image
                        source={{uri: BASE_URL + savedJob?.job?.company.logo}}
                        style={styles.logo}
                      />
                    ) : (
                      <Ionicons
                        name="business"
                        size={36}
                        color="gray"
                        style={styles.logo}
                      />
                    )}
                    <View style={styles.companyMaincontainer}>
                      <View style={styles.companyDetail}>
                        {savedJob?.job?.company?.company_name && (
                          <Text style={styles.companyText}>
                            {savedJob?.job?.company?.company_name}
                          </Text>
                        )}
                        {savedJob?.rating && (
                          <View style={styles.icon}>
                            <Ionicons
                              name="star"
                              size={14}
                              color="#ffd700"
                              style={styles.ratingIcon}
                            />
                            <Text style={styles.companyReview}>
                              {savedJob?.rating}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  {savedJob?.job?.created_at && (
                    <Text style={styles.companyDate}>
                      {moment(savedJob?.job?.created_at).format('MMM D')}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View>
            <Image
            //   style={JobCardStyle.jobimage}
            //   source={require('../../Assets/invitesImages/Jobsearch.png')}
            />
            <Text>No Saved jobs.....</Text>
          </View>
        )}
      </ScrollView> */}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
  },

  cardContent: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobTitleContainer: {
    width: width * 0.78,
  },
  bookmarkIconContainer: {
    width: width * 0.2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blackText,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
  },

  detailsText: {
    fontSize: 12,
    color: colors.blackText,
    marginLeft: 6,
  },
  detailscompanytext: {
    fontSize: 10,
    color: colors.blackText,
  },
  containerData: {
    flexDirection: 'row',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsalary: {
    gap: 8,
    flexDirection: 'row',
    marginLeft: 12,
    alignItems: 'center',
  },
  innerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },

  iconMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyDetail: {
    flexDirection: 'column',
  },
  companyMaincontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: 'contain', // Adjusts the image to cover the container uniformly
    marginRight: 8,
  },

  companyText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 2,
  },
  companyReview: {
    fontSize: 12,
    color: 'gray',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: 4,
  },
  companyDate: {
    fontSize: 12,
    alignItems: 'center',
    color: 'gray',

    // textAlign:'right',
  },
});

export default SavedJobScreen;
