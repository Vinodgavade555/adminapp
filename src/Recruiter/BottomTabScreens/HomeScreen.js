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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BarChart} from 'react-native-chart-kit';
const screenWidth = Dimensions.get('window').width - 40;

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
        const recruiter_id = await AsyncStorage.getItem('user_data');
        setId(recruiter_id);
        if (recruiter_id) {
          dispatch(GetHomePageData(recruiter_id));
        }
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, []);

  const data = [
    {
      title: 'Job Open',
      value: HomeData?.total_opening_jobs
        ? HomeData.total_opening_jobs.toLocaleString()
        : '0',
      icon: 'briefcase',
    },
    {
      title: 'Active Jobs',
      value: HomeData?.total_active_jobs
        ? HomeData.total_active_jobs.toLocaleString()
        : '0',
      icon: 'checkmark-circle',
    },
    {
      title: 'Total Applications',
      value: HomeData?.total_application_count
        ? HomeData.total_application_count.toLocaleString()
        : '0',
      icon: 'document-text',
    },
  ];

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Days of the week
    datasets: [
      {
        data: [20, 35, 40, 60, 30, 50, 70], // Job application counts
        color: (opacity = 1) => `rgba(34, 94, 190, ${opacity})`, // Bar color
        strokeWidth: 2, // Bar border thickness
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 94, 190, ${opacity})`, // Bar color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
    strokeWidth: 2,
    barPercentage: 0.6,
    fillShadowGradient: '#225EBE',
    fillShadowGradientOpacity: 1,
  };

  // const screenWidth = Dimensions.get('window').width;

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

        <Text style={styles.tableheading}>Job Summary</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}>
          {data.map((item, index) => (
            <View key={index} style={[styles.card]}>
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={colors.secondary}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chartcard}>
          <View style={styles.upperContainer}>
            <Text style={styles.title}>Job Applications</Text>
            <Text style={styles.subtitle}>Last 7 days</Text>
            <View style={styles.totalContainer}>
              <Text style={styles.totalApplicants}>150</Text>
              <Text style={styles.increase}>↑ +76</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <BarChart
              data={weeklyData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              withHorizontalLabels={false}
              withInnerLines={false}
              yAxisLabel=""
              yAxisInterval={1}
              showBarTops={true}
              showValuesOnTopOfBars={true}
            />
          </View>
        </View>

        {HomeData.top_20_related_to_recent_jobs && (
          <View>
            <Text style={styles.Containertitle}>
              Top20 Users related to recent jobs
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              style={{paddingVertical: 12}}>
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

        {HomeData.recent_job_applications && (
          <View>
            <Text style={styles.Containertitle}>
              Recent User job applications
            </Text>

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
                    item={item.user_id}
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
                    <View style={styles.jobCardContent}>
                      {job?.job_title?.title || job?.created_at ? (
                        <View style={styles.titleContainer}>
                          {job?.job_title?.title && (
                            <Text style={styles.jobTitle}>
                              {job.job_title.title}
                            </Text>
                          )}
                          {job?.created_at && (
                            <Text style={styles.jobDate}>
                              {moment(job.created_at).format('DD MMM')}
                            </Text>
                          )}
                        </View>
                      ) : null}
                      {job?.company?.company_name ? (
                        <Text style={styles.companyName}>
                          {job.company.company_name}
                        </Text>
                      ) : null}
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

                      {job?.experience_level ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4,
                          }}>
                          <Icon
                            name="briefcase"
                            size={14}
                            color={colors.primary}
                            style={styles.icon}
                          />
                          <Text style={styles.experienceLevel}>
                            {`${job.experience_level.minYear} - ${job.experience_level.maxYear} years`}
                          </Text>
                        </View>
                      ) : null}

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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
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
    width: '100%',
  },

  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    marginBottom: 12,
    marginTop: 12,
    width: 105,
  },

  value: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00',
  },
  iconWrapper: {
    backgroundColor: '#fff', // Change this to any color you want
    width: 32, // Size of the circle
    height: 32, // Size of the circle
    borderRadius: 20, // Makes the background circular
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Space between the icon and text
    borderColor: '#1aa3ff',
    borderWidth: 1,
  },
  welcomeBanner: {
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
    marginBottom: 8,
  },
  tableheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
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
    marginTop: 4,
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
  chartcard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 18,
  },
  upperContainer: {
  paddingHorizontal: 20,
  marginTop:10
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalApplicants: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  increase: {
    fontSize: 14,
    color: 'green',
    marginLeft: 10,
    fontWeight: '600',
  },
  chartContainer: {
    width: '100%',
  },

  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    position: 'relative',
  },
  bar: {
    backgroundColor: '#A3C8FF',
    borderRadius: 4,
  },
  barValue: {
    position: 'absolute',
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  barLabel: {
    marginTop: 2,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default HomeScreen;
