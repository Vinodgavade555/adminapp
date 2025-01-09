import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import HeroScroll from '../../Components/HeroScroll';
import {Text} from 'react-native-paper';
import {colors} from '../../Global_CSS/TheamColors';
import CustomDataTable from '../../Constant/CustomDataTable';
import moment from 'moment';
import ApplicationResponseChart from '../../Constant/ApplicationResponseChart';
import {useDispatch, useSelector} from 'react-redux';
import JobViewController from '../../Redux/Action/JobViewController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('Monthly');
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  const {GetHomePageData} = JobViewController();
  const {HomeData} = useSelector(state => state.job);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  const filterDataByTab = () => {
    const today = moment();
    if (activeTab === 'Monthly') {
      return jobData.filter(job => moment(job.date).isSame(today, 'month'));
    } else if (activeTab === 'Weekly') {
      return jobData.filter(job => moment(job.date).isSame(today, 'week'));
    } else if (activeTab === 'Today') {
      return jobData.filter(job => moment(job.date).isSame(today, 'day'));
    }
    return jobData;
  };

  const updateDatesForTab = data => {
    const today = moment();
    if (activeTab === 'Monthly') {
      return data.map(job => ({
        ...job,
        date: today
          .clone()
          .subtract(Math.floor(Math.random() * 30), 'days')
          .format('YYYY-MM-DD'),
      }));
    } else if (activeTab === 'Weekly') {
      return data.map(job => ({
        ...job,
        date: today
          .clone()
          .subtract(Math.floor(Math.random() * 7), 'days')
          .format('YYYY-MM-DD'),
      }));
    } else if (activeTab === 'Today') {
      return data.map(job => ({
        ...job,
        date: today.format('YYYY-MM-DD'),
      }));
    }
    return data;
  };

  const preprocessData = (data = []) => {
    // Validate that data is an array
    if (!Array.isArray(data)) {
      // console.warn('preprocessData received invalid data:', data);
      return [];
    }
    // Map through each item to extract specific fields
    return data.map(job => ({
      createdAt: moment(job.created_at).format('DD MMM YYYY'),
      jobTitle: job.job_title?.title || null, // Extract title safely
      applicantCount: job.applicant_count || 0, // Default to 0 if undefined
      openingsCount: job.openings || 0, // Default to 0 if undefined
      workmode: job.employment_types?.join(', ') || '',
      status: job.is_active ? 'Active' : 'Inactive',
    }));
  };

  const processedJobs = preprocessData(HomeData.recent_jobs || []);
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
        //Hero Scroll
        <HeroScroll />
        <View style={styles.TableContainer}>
          <View style={styles.TableHeadingContainer}>
            <Text style={styles.tableheading}>Recent Jobs</Text>
          </View>

          {HomeData.recent_jobs && HomeData.recent_jobs.length > 0 ? (
            HomeData.recent_jobs.map((job, index) => (
              <View key={index} style={styles.jobCard}>
                <View style={styles.jobCardContent}>
                <View style={styles.titleContainer}>
          <Text style={styles.jobTitle}>{job.job_title?.title || 'No Title'}</Text>
          <Text style={styles.jobDate}>
            {job.created_at ? moment(job.created_at).format('DD MMM YYYY') : 'No Date'}
          </Text>
        </View>
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
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.applications}>
                      Applications: {job.applicant_count || 0} |
                    </Text>

                    <Text style={styles.openings}>
                      Openings: {job.openings || 0}
                    </Text>
                  </View>
                </View>

                
              </View>
            ))
          ) : (
            <Text>No recent jobs available</Text>
          )}
        </View>
        <ApplicationResponseChart />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    padding: 12,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeBanner: {
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
    borderRadius: 8,
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
  TableContainer: {
    marginTop: 12,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80, // Ensures badges have enough width
    marginVertical: 4, // Adds spacing
  },
  statusText: {
    color: '#f60b0b',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  TableHeadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,

    marginBottom: 8,
    marginHorizontal: 12,
  },
  tableheading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tableheadingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 16,
  },
  Tab: {
    fontSize: 12,
    color: '#888',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    textAlign: 'center',
    marginRight: 4,
  },
  activeTab: {
    color: '#fff',
    backgroundColor: colors.primary,
    fontWeight: 'bold',
  },
  jobCard: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Aligns title to the left and date to the right
    alignItems: 'center',             // Vertically centers title and date
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',                    // Adjust as needed
  },
  jobDate: {
    fontSize: 12,
    color: '#888',                    // Lighter color for date
    textAlign: 'right',               // Align the date to the right side
  },
  companyName: {
    fontSize: 16,
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
  applications: {
    fontSize: 11,
    color: colors.primary,
  },
  openings: {
    fontSize: 11,
    color: colors.primary,
    marginLeft: 4,
  },
  jobDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default HomeScreen;
