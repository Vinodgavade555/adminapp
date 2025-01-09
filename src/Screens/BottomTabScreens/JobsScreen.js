import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobViewController from '../../Redux/Action/JobViewController';
import {useNavigation} from '@react-navigation/native';
const {width} = Dimensions.get('window'); // Get the screen width

const JobsScreen = () => {
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
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

  // Handle fetching more jobs when the user scrolls to the bottom
  const loadMoreJobs = () => {
    if (!isLoading && id && JobListPagination.next_page_number) {
      dispatch(GetJobList(id, JobListPagination.next_page_number)); // Dispatch the action to load more jobs
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={JobList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={{height: 150, margin: 24}}>
            <Text style={{color: '#000'}}>{item?.job_title?.title}</Text>
          </View>
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
  // Add styles here
});

export default JobsScreen;
