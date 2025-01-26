import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {colors} from '../../Global_CSS/TheamColors';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import UserCard from '../../Constant/UserCard';
import JobViewController from '../RecruiterRedux/Action/JobViewController';

const {width} = Dimensions.get('window');
const HomeScreen = () => {
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {GetHomePageData} = JobViewController();
  const {HomeData} = useSelector(state => state.job);

  // console.log('Full Data:',HomeData?.recent_job_applications);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_data');
        setId(userId);
        if (userId) {
          dispatch(GetHomePageData(userId));
        }
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, []);

  const data = [
    {
      title: 'Total Openings by Country',
      value: HomeData?.total_opening_jobs
        ? HomeData.total_opening_jobs.toLocaleString()
        : '0',
      description: 'Jobs available worldwide',
    },
    {
      title: 'Total Hired by Platform',
      value: HomeData?.total_hired_count
        ? HomeData.total_hired_count.toLocaleString()
        : '0',
      description: 'Candidates hired successfully',
    },
    {
      title: 'Total Applications',
      value: HomeData?.total_application_count
        ? HomeData.total_application_count.toLocaleString()
        : '0',
      description: 'Applications submitted',
    },
  ];

  return (
    <View style={styles.Maincontainer}>
      <ScrollView style={styles.container}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View>
            <Text style={styles.welcomeText}>Welcome to FlexHire</Text>
            <Text style={styles.AdminName}>Admin</Text>
          </View>
          <Image
            style={styles.adminbanImg}
            source={require('../../Assets/Images/Admin.png')}
          />
        </View>

        <ScrollView
          horizontal
          // pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}>
          {data.map((item, index) => (
            <View key={index} style={[styles.card]}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 1, y: 2}}
                colors={['#0088cc', '#006699', '#004466']}
                style={styles.linearGradient}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.value}>{item.value}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>

        {HomeData.recent_jobs && HomeData.recent_jobs.length > 0 && (
          <View style={styles.TableHeadingContainer}>
            <Text style={styles.tableheading}>Recent Jobs</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScrollView}>
              {HomeData.recent_jobs && HomeData.recent_jobs.length > 0 ? (
                HomeData.recent_jobs.map((job, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.jobCard}
                    onPress={() =>
                      navigation.navigate('RecruiterStack', {
                        screen: 'JobDetail',
                        params: {jobId: job.id},
                      })
                    }>
                    {/* {console.log('Job ID:', job.id)} */}
                    <View style={styles.jobCardContent}>
                      <View style={styles.titleContainer}>
                        <Text style={styles.jobTitle}>
                          {job.job_title?.title || 'No Title'}
                        </Text>
                        <Text style={styles.jobDate}>
                          {job.created_at
                            ? moment(job.created_at).format('DD MMM')
                            : 'No Date'}
                        </Text>
                      </View>
                      <Text style={styles.companyName}>
                        {' '}
                        {job.company?.company_name || 'No Title'}
                      </Text>
                      {job.job_location && job.job_location.length > 0 ? (
                        <View style={styles.locationContainer}>
                          <Icon
                            name="map-marker"
                            size={14}
                            color={colors.primary}
                            style={styles.locationIcon}
                          />
                          <Text style={styles.companyLocation}>
                            {job.job_location.join(', ')}
                          </Text>
                        </View>
                      ) : null}

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon
                          name="briefcase"
                          size={14}
                          color={colors.primary}
                          style={styles.icon}
                        />
                        <Text style={styles.experienceLevel}>
                          {job.experience_level
                            ? `${job.experience_level.minYear} - ${job.experience_level.maxYear} years`
                            : 'Experience Level not specified'}
                        </Text>
                      </View>

                      <View style={styles.horizontalLine} />

                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.applications}>
                          Applications: {job.applicant_count || 0} |
                        </Text>

                        <Text style={styles.openings}>
                          Openings: {job.openings || 0}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No recent jobs available</Text>
              )}
            </ScrollView>
          </View>
        )}

        {HomeData.top_20_related_to_recent_jobs && (
          <View>
            <Text style={styles.Containertitle}>
              Top20 related to recent jobs
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              style={{paddingVertical: 8}}>
              {HomeData.top_20_related_to_recent_jobs &&
              HomeData.top_20_related_to_recent_jobs.length > 0 ? (
                HomeData.top_20_related_to_recent_jobs.map((item, index) => (
                  <UserCard
                    key={index}
                    item={item}
                    jobId={''}
                    page_name={'home'}
                    index={index}
                    isHorizontal={true}
                  />
                ))
              ) : (
                <Text>No recent jobs available</Text>
              )}
            </ScrollView>
          </View>
        )}

        {HomeData.top_20_related_to_recent_jobs && (
          <View>
            <Text style={styles.Containertitle}>Recent job applications</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              style={{paddingVertical: 8}}>
              {HomeData.recent_job_applications &&
              HomeData.recent_job_applications.length > 0 ? (
                HomeData.recent_job_applications.map((item, index) => (
                  <UserCard
                    key={index}
                    item={item}
                    jobId={''}
                    page_name={'home'}
                    index={index}
                    isHorizontal={true}
                  />
                ))
              ) : (
                <Text>No recent jobs available</Text>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    // padding: 12,
    marginHorizontal: 12,
    width: '100%',
  },
  scrollContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Containertitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
  horizontalScrollView: {
    paddingHorizontal: 10,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
  },
  scrollView: {
    flexGrow: 0,
    marginHorizontal: 12,
  },
  card: {
    flex: 1,
    width: '100%',
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linearGradient: {
    padding: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color: '#f0f0f0',
    textAlign: 'center',
  },
  welcomeBanner: {
    // width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 12,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    margin: 12,
  },
  AdminName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    margin: 12,
  },
  adminbanImg: {
    width: 100,
    height: 100,
  },

  TableHeadingContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
    // marginHorizontal: 12,
  },
  tableheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 12,
    marginLeft: 12,
  },

  jobCard: {
    backgroundColor: colors.whiteText,
    marginTop: 18,
    borderRadius: 8,
    marginRight: 12,
    padding: 12,
    width: width * 0.7,
    marginBottom: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Aligns title to the left and date to the right
    alignItems: 'center', // Vertically centers title and date
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Adjust as needed
  },
  jobDate: {
    fontSize: 12,
    color: '#888', // Lighter color for date
    textAlign: 'right', // Align the date to the right side
  },
  companyName: {
    fontSize: 14,
    color: '#555',
  },
  companyDescription: {
    fontSize: 14,
    color: '#777',
  },
  companyTagline: {
    fontSize: 14,
    color: '#888',
  },
  companyWebsite: {
    fontSize: 14,
    color: '#0066cc',
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
  experienceLevel: {
    fontSize: 11,
    color: 'black',
    marginLeft: 4,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgaryText,
    marginTop: 4,
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
  // jobDate: {
  //   fontSize: 12,
  //   color: '#888',
  //   marginTop: 4,
  // },
});

export default HomeScreen;
