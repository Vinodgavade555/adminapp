import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import {IconButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const data = [
  {
    filter: 'pref_locations',
    data: [
      {
        name: 'Mumbai',
        count: 5,
      },
      {
        name: 'Bangalore',
        count: 4,
      },
      {
        name: 'Hyderabad',
        count: 3,
      },
      {
        name: 'Delhi',
        count: 2,
      },
      {
        name: 'Pune',
        count: 6,
      },
    ],
  },
  {
    filter: 'current_city',
    data: [
      {
        name: 'Mumbai',
        count: 7,
      },
      {
        name: 'Bangalore',
        count: 5,
      },
      {
        name: 'Pune',
        count: 4,
      },
      {
        name: 'Chennai',
        count: 3,
      },
    ],
  },
  {
    filter: 'key_skills',
    data: [
      {
        name: 'Python',
        count: 10,
      },
      {
        name: 'Java',
        count: 8,
      },
      {
        name: 'SQL',
        count: 5,
      },
      {
        name: 'Data Analysis',
        count: 6,
      },
      {
        name: 'UI/UX Design',
        count: 4,
      },
    ],
  },
  {
    filter: 'notice_period',
    data: [
      {
        name: 'Immediate',
        count: 5,
      },
      {
        name: '15 Days',
        count: 4,
      },
      {
        name: '30 Days',
        count: 6,
      },
      {
        name: '60 Days',
        count: 3,
      },
    ],
  },
  {
    filter: 'job_title',
    data: [
      {
        name: 'Software Developer',
        count: 7,
      },
      {
        name: 'Data Analyst',
        count: 5,
      },
      {
        name: 'UI/UX Designer',
        count: 3,
      },
      {
        name: 'Project Manager',
        count: 4,
      },
      {
        name: 'System Architect',
        count: 2,
      },
    ],
  },
  {
    filter: 'current_annual_salary',
    data: [
      {
        name: '0-3 Lakhs',
        count: 4,
      },
      {
        name: '3-5 Lakhs',
        count: 5,
      },
      {
        name: '5-10 Lakhs',
        count: 7,
      },
      {
        name: '10-15 Lakhs',
        count: 3,
      },
      {
        name: '15+ Lakhs',
        count: 2,
      },
    ],
  },
];

const JobsScreen = () => {
  const [id, setId] = useState(null);
  const [query, setQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [searchQueryData, setSearchQueryData] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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

  // console.log('data', JobList);

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

  const handleCardPress = jobId => {
    navigation.navigate('JobDetail', {jobId: jobId});
    // console.log(jobId);
  };

  // Filter Jobs code Starts
  const openFiltermodal = () => {
    setQuery('');
    setSearchQueryData('');
    setFilterModalVisible(true);
  };
  const closeFiltermodal = () => {
    setFilterModalVisible(false);
  };
  const SearchJobs = searchText => {
    setFilterQuery('');
    // Normalize the search query: trim spaces and convert to lowercase
    const normalizedQuery = searchText?.trim().toLowerCase();

    if (normalizedQuery) {
      const queryParams = {
        job_title: normalizedQuery, // Use the normalized query
        page: 1,
      };
      setSearchQueryData(queryParams);
      // dispatch(GetSearchJobs({user_id: id, ...queryParams}));
    }
  };

  return (
    <View style={styles.Container}>
      <View style={styles.container}>
        <View style={styles.searchbarContainer}>
          <TextInput
            placeholder="Search"
            // onChangeText={setQuery}
            onChangeText={text => {
              if (text.length === 0) {
                // setJobListToRender(JobList);
              }
              setQuery(text); // Update query state
              // SearchJobs(text); // Trigger dynamic search
            }}
            value={query}
            style={styles.searchbar}
            placeholderTextColor="#000"
          />
          <IconButton
            style={styles.searchIcon}
            icon="magnify"
            iconColor="#004466"
            size={26}
            onPress={() => SearchJobs(query)}
          />
        </View>
        <TouchableOpacity
          style={styles.filterIconContainer}
          onPress={openFiltermodal}>
          <Ionicons name="filter-outline" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={JobList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(item.id)}>
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

            <View style={{flexDirection: 'row', marginTop: 8}}>
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
       {/* <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
           
            <View style={styles.modalHeader}>
              <Text style={styles.headerTitle}>Filters</Text>
              <TouchableOpacity onPress={closeFiltermodal}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{width: width * 0.35}}>
               
                <ScrollView style={[styles.categoriesContainer]}>
                  {[...FilterMasterData, {filter: 'experience'}].map(
                    filterCategory => (
                      <TouchableOpacity
                        key={filterCategory.filter}
                        style={[
                          styles.categoryButton,
                          selectedCategory === filterCategory.filter && [
                            styles.selectedCategoryButton,
                            {backgroundColor: '#e6f7ff'},
                          ],
                        ]}
                        onPress={() =>
                          setSelectedCategory(filterCategory.filter)
                        }>
                        <Text
                          style={[
                            styles.categoryButtonText,
                            selectedCategory === filterCategory.filter && {
                              fontWeight: 'bold',
                            },
                          ]}>
                          {filterCategory.filter
                            .replace('_', ' ')
                            .toLowerCase()
                            .replace(/^\w/, c => c.toUpperCase())}
                        </Text>
                        <Text style={{color: 'grey', fontSize: 10}}>
                          {filterCategory.filter !== 'experience' &&
                            filterCategory.filter !== 'salary' &&
                            filters[filterCategory.filter]?.length > 0 &&
                            ` (${filters[filterCategory.filter].length})`}

                          {filterCategory.filter === 'experience' &&
                            selectedExperience > 0 &&
                            ` (${selectedExperience} Y)`}

                          {filterCategory.filter === 'salary' &&
                            minSalary &&
                            maxSalary &&
                            ` • (${minSalary} - ${maxSalary})`}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </ScrollView>

              </View>
              <View style={styles.optionsContainer}>
                {selectedCategory && renderFilterOptions(selectedCategory)}
              </View>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearAllFilters}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApplyFilters()}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    // flex: 1,
    backgroundColor: colors.background,
    // paddingHorizontal: 12,
    // width: '100%',
  },
  container: {
    // flex: 1,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    height: 70,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 8,
    // marginBottom: 12,
  },
  searchbarContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.cardBgcolor,
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    marginRight: 10,
    backgroundColor: '#fff',
  },
  filterIconContainer: {
    backgroundColor: '#fff',
    padding: 8,
    height: 48,
    borderRadius: 8,
  },
  card: {
    flex: 1,
    marginVertical: 8, // Reduce margin between cards
    padding: 12, // Less padding inside the card
    backgroundColor: '#fff',
    borderRadius: 8,
    width: width * 1 - 24,
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