import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import UserCard from '../../Constant/UserCard';
import JobViewController from '../RecruiterRedux/Action/JobViewController';
import {FlatList} from 'react-native-gesture-handler';

const ShortlistCandidate = ({route}) => {
  const [id, setId] = useState();
  const {jobId} = route.params; // Get company data from params
  const dispatch = useDispatch();
  const {GetUserShortlistedList} = JobViewController();
  const {UserShortlistedList, isLoading, error, UserShortlitedListPagination} =
    useSelector(state => state.job);
  const isFocus = useIsFocused();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const recruiter_id = await AsyncStorage.getItem('user_data');
        setId(recruiter_id);
        dispatch(GetUserShortlistedList(jobId, recruiter_id, 1));
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };
    getUserData();
  }, [isFocus, dispatch]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Something went wrong. Please try again later!
        </Text>
      </View>
    );
  }
  console.log('UserShortlistedList', UserShortlistedList);
  const loadMoreUsers = () => {
    if (
      !isLoading &&
      id &&
      UserShortlitedListPagination?.next_page_number != null
    ) {
      dispatch(
        GetUserShortlistedList(
          jobId,
          id,
          UserShortlitedListPagination.next_page_number,
        ),
      );
    }
  };
  return (
    <View style={{}}>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 18}}
        data={UserShortlistedList}
        keyExtractor={(item, index) => `${item.id || index}`}
        renderItem={({item, index}) => (
          <UserCard item={item} jobId={jobId} page_name={''} index={index} />
        )}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>No shortlisted candidates available</Text>}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  loader: {marginTop: 20},
  errorContainer: {marginTop: 20, alignItems: 'center'},
  errorText: {color: 'red', fontSize: 16},
  noDataText: {fontSize: 18, textAlign: 'center', marginTop: 20, color: '#888'},
});

export default ShortlistCandidate;
