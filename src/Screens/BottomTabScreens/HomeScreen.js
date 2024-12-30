import React, {useState} from 'react';
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
const jobData = [
  {
    id: '1',
    title: 'UI UX Designer',
    category: 'Full Time',
    openings: 12,
    applications: 135,
    status: 'Active',
    date: '2024-12-01',
  },
  {
    id: '2',
    title: 'Full Stack Dev',
    category: 'Full Time',
    openings: 8,
    applications: 100,
    status: 'Inactive',
    date: '2024-11-28',
  },
  {
    id: '3',
    title: 'DevOps',
    category: 'Internship',
    openings: 12,
    applications: 5,
    status: 'Active',
    date: '2024-12-02',
  },
  {
    id: '4',
    title: 'Android Dev',
    category: 'Full Time',
    openings: 4,
    applications: 45,
    status: 'Active',
    date: '2024-12-01',
  },
  {
    id: '5',
    title: 'IOS Developer',
    category: 'Full Time',
    openings: 18,
    applications: 96,
    status: 'Inactive',
    date: '2024-12-04',
  },
  {
    id: '6',
    title: 'Project Manager',
    category: 'Part Time',
    openings: 3,
    applications: 40,
    status: 'Active',
    date: '2024-12-02',
  },
  {
    id: '7',
    title: 'Data Analyst',
    category: 'Full Time',
    openings: 9,
    applications: 120,
    status: 'Active',
    date: '2024-11-27',
  },
  {
    id: '8',
    title: 'Machine Learning Engineer',
    category: 'Full Time',
    openings: 5,
    applications: 67,
    status: 'Inactive',
    date: '2024-11-28',
  },
  {
    id: '9',
    title: 'Backend Developer',
    category: 'Full Time',
    openings: 10,
    applications: 200,
    status: 'Active',
    date: '2024-12-03',
  },
  {
    id: '10',
    title: 'Frontend Developer',
    category: 'Full Time',
    openings: 7,
    applications: 150,
    status: 'Inactive',
    date: '2024-11-28',
  },
  {
    id: '11',
    title: 'Graphic Designer',
    category: 'Part Time',
    openings: 2,
    applications: 30,
    status: 'Active',
    date: '2024-11-29',
  },
  {
    id: '12',
    title: 'QA Engineer',
    category: 'Full Time',
    openings: 6,
    applications: 85,
    status: 'Inactive',
    date: '2024-12-01',
  },
  {
    id: '13',
    title: 'HR Manager',
    category: 'Full Time',
    openings: 3,
    applications: 60,
    status: 'Active',
    date: '2024-11-27',
  },
  {
    id: '14',
    title: 'Cloud Engineer',
    category: 'Full Time',
    openings: 8,
    applications: 110,
    status: 'Active',
    date: '2024-11-29',
  },
  {
    id: '15',
    title: 'Database Admin',
    category: 'Internship',
    openings: 1,
    applications: 20,
    status: 'Inactive',
    date: '2024-12-02',
  },
  {
    id: '16',
    title: 'Digital Marketer',
    category: 'Full Time',
    openings: 4,
    applications: 50,
    status: 'Active',
    date: '2024-11-30',
  },
  {
    id: '17',
    title: 'Content Writer',
    category: 'Part Time',
    openings: 3,
    applications: 25,
    status: 'Active',
    date: '2024-12-04',
  },
  {
    id: '18',
    title: 'System Administrator',
    category: 'Full Time',
    openings: 5,
    applications: 75,
    status: 'Inactive',
    date: '2024-12-01',
  },
  {
    id: '19',
    title: 'Sales Executive',
    category: 'Full Time',
    openings: 12,
    applications: 140,
    status: 'Active',
    date: '2024-12-02',
  },
  {
    id: '20',
    title: 'Cybersecurity Analyst',
    category: 'Full Time',
    openings: 7,
    applications: 90,
    status: 'Active',
    date: '2024-11-28',
  },
];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('Monthly');

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

  const filteredData = updateDatesForTab(filterDataByTab());
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

        {/* Hero Scroll */}
        <HeroScroll />

        {/* Custom DataTable */}
        <View style={styles.TableContainer}>
          <View style={styles.TableHeadingContainer}>
            <Text style={styles.tableheading}>Recent Jobs</Text>
            <View style={styles.tableheadingContainer}>
              {['Monthly', 'Weekly', 'Today'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => handleTabChange(tab)}>
                  <Text
                    style={[
                      styles.Tab,
                      activeTab === tab && styles.activeTab, // Apply active style if this tab is active
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <CustomDataTable
            columns={[
              {header: 'Job Title', field: 'title'},
              {header: 'Category', field: 'category'},
              {header: 'Openings', field: 'openings'},
              {header: 'Applications', field: 'applications'},
              {
                header: 'Status',
                field: 'status',
              },
            ]}
            data={filteredData} // Fallback to an empty array if undefined
            rowsPerPageOptions={[5, 10]}
          />
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
    backgroundColor: '#fff',

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
});

export default HomeScreen;
