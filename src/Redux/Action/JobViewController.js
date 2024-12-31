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
        const id = await AsyncStorage.getItem('user_data'); 
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

  const GetJobApplications = user_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(
        `http://15.206.149.28/api/job-application/${user_id}/`,
      );
      // console.log(
      //   '****************************job-application response***************************',
      // );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'JOB_APPLICATION_SUCCESS', payload: data});

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
        type: 'JOB_APPLICATION_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetJobDetails = (job_id, user_id) => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(
        // `http://15.206.149.28/api/job/${job_id}/`,
        {
          params: {
            user_id: user_id,
          },
        },
      );
      // console.log(
      //   '****************************job-details response***************************',
      // );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'JOB_DETAILS_SUCCESS', payload: data});
      dispatch({type: 'LOADING', payload: false});
    } catch (error) {
      console.log('error', error.response);

      dispatch({type: 'LOADING', payload: false});
      Toast.show(
        error.response?.data?.non_field_errors[0]
          ? error.response.data.non_field_errors[0]
          : 'Something went wrong, Please try again!',
        {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          offset: 100,
          animationType: 'slide-in',
        },
      );
      dispatch({
        type: 'JOB_DETAILS_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetApplyJob = requestData => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(
        `http://15.206.149.28/api/job-application/`,
        requestData,
      );
      // console.log(
      //   '****************************job-application response***************************',
      // );
      // console.log(response);

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);

      dispatch({type: 'JOB_APPLIED_SUCCESSFULLY', payload: data});

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
        type: 'JOB_APPLIED_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetHomeData = user_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(
        `http://15.206.149.28/api/jobs/homepage/${user_id}`,
      );
      // console.log(
      //   '****************************job-GetHomeData response***************************',
      // );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'JOB_HOMEDATA_SUCCESS', payload: data});

      dispatch({type: 'LOADING', payload: false});
    } catch (error) {
      // console.log('error', error.response);

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
        type: 'JOB_HOMEDATA_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetJobList = user_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get(`http://15.206.149.28/api/jobs/`);
      // console.log(
      //   '****************************job-GetJobList response***************************',
      // );
      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'JOB_LIST_SUCCESS', payload: data});

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
        type: 'JOB_LIST_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetBasicProfileInformation = user_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.get
      (`http://15.206.149.28/api/jobs/`);
      // console.log(
      //   '****************************job-GetJobList response***************************',
      // );
      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'PROFILE_DATA_SUCCESS', payload: data});

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
        type: 'PROFILE_DATA_FAILURE',
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
    GetJobApplications,
    GetJobDetails,
    GetHomeData,
    GetJobList,
    GetApplyJob,
    GetBasicProfileInformation
  };
};

export default JobViewController;
