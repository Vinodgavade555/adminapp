import {Toast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useEffect, useState} from 'react';

const JobViewController = () => {
  const navigation = useNavigation();
  const [_userId, set_userId] = useState();
  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data'); // Wait for the value to be retrieved
        set_userId(id);
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, []);
  const goBackScreen = () => {
    navigation.goBack();
  };

  const GetJobList = (employer_id,page) => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(
        `http://15.206.149.28/api/jobs-by-employer/${employer_id}/?page=${page}`,
      );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      console.log(data);
      dispatch({type: 'LOADING', payload: false});
      dispatch({type: 'JOB_LIST_SUCCESS', payload: data});
    } catch (error) {
      console.log('error', error.response);

      dispatch({type: 'LOADING', payload: false});
      Toast.show(
        error.response?.data?.non_field_errors[0]
          ? error.response.data.non_field_errors[0]
          : 'Something went wrong,Please Try again!',
        {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          offset: 100,
          animationType: 'slide-in',
        },
      );
      dispatch({
        type: 'JOB_LIST_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetAppliedJobSeekerList = job_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(
        `http://15.206.149.28/api/job/${job_id}/applied-users`,
      );
      console.log(
        `****************************job-GetAppliedJobSeekerList response***************************
        http://15.206.149.28/api/job/${job_id}/applied-users/`,
      );
      // console.log('response', response);

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      console.log(data);

      dispatch({type: 'APPLIED_JOB_SEEKER_LIST_SUCCESS', payload: data});

      dispatch({type: 'LOADING', payload: false});
    } catch (error) {
      console.log('error', error.response);

      dispatch({type: 'LOADING', payload: false});
      Toast.show(
        error.response?.data?.non_field_errors[0]
          ? error.response.data.non_field_errors[0]
          : 'Something went wrong,Please Try again!',
        {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          offset: 100,
          animationType: 'slide-in',
        },
      );
      dispatch({
        type: 'APPLIED_JOB_SEEKER_LIST_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetHomePageData = employer_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(
        `http://15.206.149.28/api/employer-home-page-data/${employer_id}`,
      );
      console.log(
        '****************************job-GetHomedata response***************************',
        response,
      );
      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      console.log(data);

      dispatch({type: 'HOME_DATA_SUCCESS', payload: data});

      dispatch({type: 'LOADING', payload: false});
    } catch (error) {
      console.log('error', error.response);

      dispatch({type: 'LOADING', payload: false});
      Toast.show(
        error.response?.data?.non_field_errors[0]
          ? error.response.data.non_field_errors[0]
          : 'Something went wrong,Please Try again!',
        {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          offset: 100,
          animationType: 'slide-in',
        },
      );
      dispatch({
        type: 'HOME_DATA_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  return {
    goBackScreen,
    GetJobList,
    GetAppliedJobSeekerList,
    GetHomePageData,
  };
};

export default JobViewController;
