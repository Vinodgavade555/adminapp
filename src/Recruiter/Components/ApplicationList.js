import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../Global_CSS/TheamColors';
import UserCard from '../../Constant/UserCard';
import JobViewController from '../RecruiterRedux/Action/JobViewController';

const ApplicationsListScreen = ({route}) => {
  const {jobId} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {GetJobApplications} = JobViewController();

  // Select JobApplications state from the Redux store
  const {JobApplications} = useSelector(state => state.job);
  const isFocus = useIsFocused();
  const [selectedTab, setSelectedTab] = React.useState('matching');
  const [id, setId] = useState('');

  const handleTabChange = tab => {
    setSelectedTab(tab);
  };

   
  useEffect(() => {
    const getUserData = async () => {
      try {
        const recruiter_id = await AsyncStorage.getItem('user_data');
        // Dispatch the action to fetch job applications
        dispatch(GetJobApplications(jobId, recruiter_id));
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, [dispatch, jobId, isFocus]);

  useEffect(() => {
    // console.log('JobApplications state updated:', JobApplications);
  }, [JobApplications]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Job Application Details</Text>
      <View style={styles.matchchipsContainer}>
        <TouchableOpacity
          style={[styles.matchchip, selectedTab === 'matching' && styles.selectedChip]}
          onPress={() => handleTabChange('matching')}
        >
          <Text style={styles.matchchipText}>Matching</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.matchchip, selectedTab === 'non-matching' && styles.selectedChip]}
          onPress={() => handleTabChange('non-matching')}
        >
          <Text style={styles.matchchipText}>Non-Matching</Text>
        </TouchableOpacity>
      </View>

      {/* Render job applications based on the selected tab */}
      {(selectedTab === 'matching' ? JobApplications?.matching_applies : JobApplications?.unmatching_applies)?.map((jobApplication) => {
        const user = jobApplication?.user_id;
        const coverLetter = jobApplication?.cover_letter;

        return (
          <UserCard
            key={user?.id || user?.user_id || jobApplication?.id}  // Use a unique identifier for the key
            item={jobApplication}
            jobId={jobId}
            page_name={'application'}
            index={jobApplication?.id}  // or user?.id if it’s more appropriate
            coverLetter = {coverLetter}
            
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 18,
    marginVertical: 18,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  matchchipsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 8,
  },
  matchchip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: '#b3d7ff',
  },
  matchchipText: {
    fontSize: 12,
    color: '#004a99',
  },
});

export default ApplicationsListScreen;
