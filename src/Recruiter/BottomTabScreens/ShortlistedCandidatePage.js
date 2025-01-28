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

const ShortlistCandidate = ({route}) => {
  const [id, setId] = useState();
  const {jobId} = route.params; // Get company data from params
  const dispatch = useDispatch();
  const {GetUserShortlistedList} = JobViewController();
  const {UserShortlitedList, loading, error} = useSelector(state => state.job);
  const isFocus = useIsFocused();
  console.log('jobId:', jobId);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const recruiter_id = await AsyncStorage.getItem('user_data');
        setId(recruiter_id);
        dispatch(GetUserShortlistedList(jobId, recruiter_id));
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };
    getUserData();
  }, [isFocus, dispatch]);

  if (loading) {
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

  return (
    <ScrollView style={{paddingHorizontal: 12, paddingVertical: 18}}>
      <Text>Shortlisted Candidates</Text>
      {UserShortlitedList?.results && UserShortlitedList.results.length > 0 ? (
        UserShortlitedList.results.map((item, index) => {
          const user = item.recruiter_id; // Or item.user_id depending on your requirements
          const job_Id = item.job_id; // Or item.user_id depending on your requirements

          return (
            <UserCard
              key={index}
              item={item}
              userId={user}
              jobId={job_Id}
              page_name={'job_invitation'}
            />
          );
        })
      ) : (
        <Text>No shortlisted candidates available</Text>
      )}
    </ScrollView>
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
