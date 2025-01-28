import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const {GetJobApplications, ApplicationJobStatus, toggleshortlistUser} =
    JobViewController();
  const {JobApplications} = useSelector(state => state.job);
  const isFocus = useIsFocused();
  const [id, setId] = useState('');
  const [selectedTab, setSelectedTab] = useState('matching');

  const handleTabChange = tab => {
    setSelectedTab(tab);
  };

   
  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data');
        setId(id);
        dispatch(GetJobApplications(jobId));
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, [isFocus]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Job Application Details</Text>
      <View style={styles.matchchipsContainer}>
        <TouchableOpacity
          style={[
            styles.matchchip,
            selectedTab === 'matching' && styles.selectedChip,
          ]}
          onPress={() => handleTabChange('matching')}>
          <Text style={styles.matchchipText}>Matching</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.matchchip,
            selectedTab === 'non-matching' && styles.selectedChip,
          ]}
          onPress={() => handleTabChange('non-matching')}>
          <Text style={styles.matchchipText}>Non-Matching</Text>
        </TouchableOpacity>
      </View>
   
      

      {(selectedTab === 'matching'
        ? JobApplications?.matching_applies
        : JobApplications?.unmatching_applies
      )?.map((jobApplication, index) => {
        const user = jobApplication?.user_id;
        const coverLetter = jobApplication?.cover_letter;
        // console.log('get',jobApplication?.cover_letter);

        return (
          <UserCard
            key={index}
            item={user}
            jobId={jobId}
            page_name={'application'}
            index={index}
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
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

export default ApplicationsListScreen;
