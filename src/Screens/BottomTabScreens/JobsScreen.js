import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobViewController from '../../Redux/Action/JobViewController';
import {useNavigation} from '@react-navigation/native';
const {width} = Dimensions.get('window'); // Get the screen width
import {colors} from '../../Global_CSS/TheamColors';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const JobsScreen = () => {
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onFocus = useNavigation();
  const {GetJobList} = JobViewController();
  const {JobList, JobListPagination, isLoading} = useSelector(
    state => state.job,
  );

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_data');
        setId(userId);
        if (JobList?.length == 0) {
          dispatch(GetJobList(userId, 1)); // Fetch job list on component mount
        }
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };
    getUserData();
  }, [onFocus]);

  // console.log('data', JobList[0]);

  // Handle fetching more jobs when the user scrolls to the bottom
  const loadMoreJobs = () => {
    if (!isLoading && id && JobListPagination.next_page_number) {
      dispatch(GetJobList(id, JobListPagination.next_page_number)); // Dispatch the action to load more jobs
    }
  };

  function formatAmount(value) {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(1) + ' Cr';
    } else if (value >= 100000) {
      return (value / 100000).toFixed(1) + ' Lac';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + ' K';
    } else {
      return value.toString();
    }
  }

  const handleCardPress = (jobId) => {
    navigation.navigate('JobDetail', {jobId:jobId}); 
    // console.log(jobId);
    
  };

  return (
    <View style={styles.Container}>
      <FlatList
        data={JobList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity 
          style={styles.card}
          onPress={() => handleCardPress(item.id)}
          >
            <View style={styles.innerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.jobTitle}>
                  {item?.job_title?.title || 'No Title'}
                </Text>
                <Text style={styles.jobDate}>
                  {item?.created_at
                    ? moment(item.created_at).format('D MMM')
                    : 'No Date'}
                </Text>
              </View>
              {item?.job_location && item?.job_location?.length > 0 ? (
                <View style={styles.locationContainer}>
                  <Icon
                    name="location-sharp"
                    size={14}
                    color={colors.primary} // You can replace this with your colors.primary
                    style={styles.locationIcon}
                  />
                  <Text style={styles.companyLocation}>
                    {item.job_location.join(', ')}
                  </Text>
                </View>
              ) : null}

              <View style={{flexDirection: 'row'}}>
                {item?.experience_level && (
                  <View style={styles.experienceContainer}>
                    <Icon
                      name="briefcase"
                      size={12}
                      color={colors.primary}
                      style={styles.experienceIcon}
                    />
                    <Text style={styles.experienceText}>
                      {item.experience_level.minYear} -{' '}
                      {item.experience_level.maxYear} years
                    </Text>
                  </View>
                )}
                {item?.salary?.yearly && (
                  <View style={styles.salaryContainer}>
                    <Icon
                      name="cash"
                      size={12}
                      color={colors.primary}
                      style={styles.salaryIcon}
                    />
                    <Text style={styles.salaryText}>
                      {formatAmount(item.salary.yearly.min)} -{' '}
                      {formatAmount(item.salary.yearly.max)}{' '}
                      {item.salary.yearly.currency}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{flexDirection: 'row',marginTop:8}}>
              <Text style={styles.applications}>
                Applications: {item?.applicant_count || 0} 
              </Text>
              {/* <Text style={styles.openings}>
                Openings: {item?.openings || 0}
              </Text> */}
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreJobs} // Trigger when the end of the list is reached
        onEndReachedThreshold={0.5} // When half of the list is visible
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  card: {
    marginVertical: 8, // Reduce margin between cards
    padding: 12, // Less padding inside the card
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    alignSelf: 'center',
  },
  innerContainer: {
    backgroundColor: '#fafafa',
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  jobDate: {
    fontSize: 11,
    color: '#888',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4, // Space between the icon and text
  },
  companyLocation: {
    fontSize: 11,
    color: '#555',
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  salaryIcon: {
    marginRight: 4,
  },

  salaryText: {
    fontSize: 11,
    color: '#555',
  },

  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    margin: 2,
  },

  experienceIcon: {
    marginRight: 4,
  },

  experienceText: {
    fontSize: 11,
    color: '#555',
  },
  applications: {
    fontSize: 11,
    color: colors.primary,
  },
  openings: {
    fontSize: 11,
    color: colors.primary,
    marginLeft: 4,
  },
});

export default JobsScreen;
