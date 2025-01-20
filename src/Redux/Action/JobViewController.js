import {Toast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useEffect, useState} from 'react';
import instance from '../../Services/baseAPI';

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

  const GetJobList = (employer_id, page) => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.get(
        `/jobs-by-employer/${employer_id}/?page=${page}`,
      );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);

      dispatch({type: 'LOADING', payload: false});
      dispatch({type: 'JOB_LIST_SUCCESS', payload: data});
    } catch (error) {
      console.log('error', error);

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
      // console.log(
      //   `****************************job-GetAppliedJobSeekerList response***************************
      //   http://15.206.149.28/api/job/${job_id}/applied-users/`,
      // );
      // console.log('response', response);

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

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
      // console.log(
      //   '****************************job-GetHomedata response***************************',
      //   response,
      // );
      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

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

  const GetJobDetails = (job_id, employer_id) => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.get(`/job/${job_id}/`, {
        params: {
          employer_id: employer_id,
        },
      });
      // console.log(
      //   '****************************jobdetails response***************************',
      // );

      // console.log(`http://15.206.149.28/api/jobs-by-employer/${job_id}/`);
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
        type: 'JOB_DETAILS_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const ToggleJobStatus = (job_id, data, employer_id) => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      // Call the toggle-status API endpoint
      const response = await axios.put(
        `http://15.206.149.28/api/job/${job_id}/toggle-status/`,
        data,
      );

      dispatch(GetJobDetails(job_id, employer_id));
      dispatch({type: 'TOGGLE_JOB_STATUS_SUCCESS', payload: response.data});
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
        type: 'TOGGLE_JOB_STATUS_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetJobApplications = job_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.get(`/job/applications/${job_id}`);
      // console.log(
      //   `****************************job-GetAppliedJobSeekerList response***************************
      //   http://15.206.149.28/api/job/${job_id}/applied-users/`,
      // );
      // console.log('response', response);

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'JOB_APPLICATIONS_SUCCESS', payload: data});

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
        type: 'JOB_APPLICATIONS_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetJobInvitation = job_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.get(
        `/filter-users-for-job/${job_id}`,
      );
      // console.log(
      //   `****************************job-GetJobInvitation response***************************
      //   http://15.206.149.28/api/job/${job_id}/applied-users/`,
      // );
      // console.log('response', response);

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'JOB_INVITATION_SUCCESS', payload: data});

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
        type: 'JOB_INVITATION_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const ApplicationJobStatus =
    (application_id, data, job_id) => async dispatch => {
      dispatch({type: 'LOADING', payload: true});
      console.log(application_id, data, job_id);

      try {
        // Call the toggle-status API endpoint

        const response = await axios.put(
          `http://15.206.149.28/api/job-application/update-status/${application_id}/`,
          data,
        );
        //15.206.149.28/api/job-application/update-status/22/
        // console.log("API Response:", response.data);

        dispatch({type: 'APPLICATION_JOB_STATUS_SUCCESS'});
        dispatch({type: 'LOADING', payload: false});
        dispatch(GetJobApplications(job_id));
      } catch (error) {
        // console.log('error', error.response.data.detail);

        dispatch({type: 'LOADING', payload: false});

        Toast.show(
          error?.response?.data?.detail
            ? error.response.data.detail
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
          type: 'APPLICATION_JOB_STATUS_FAILURE',
          payload: {
            error: error.response?.data?.non_field_errors
              ? error.response.data.non_field_errors[0]
              : error?.response?.data,
          },
        });
      }
    };

  const SendInvitation = data => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await axios.post(
        `http://15.206.149.28/api/job-invitations/`,
        data,
      );

      // console.log("API Response:", response);

      dispatch({type: 'SENDINVITATION_SUCCESS', payload: data});
      dispatch({type: 'LOADING', payload: false});
    } catch (error) {
      // console.log('error', error.response.data.detail);

      dispatch({type: 'LOADING', payload: false});

      Toast.show(
        error?.response?.data?.detail
          ? error.response.data.detail
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
        type: 'SENDINVITATION_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetUserShortlistedList = job_id => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.get(`/shortlist-user/job/${job_id}`);

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      console.log(data);

      dispatch({type: 'USER_SHORTLIST_LIST_SUCCESS', payload: data});

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
        type: 'USER_SHORTLIST_LIST_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const toggleshortlistUser = requestData => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.post(
        `/recruiter-shortlist-user/`,
        requestData,
      );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);

      dispatch({type: 'ADD_TO_SHORTLIST', payload: data});
      dispatch(GetUserShortlistedList(requestData.user_id));

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
        type: 'REMOVE_FROM_SHORTLIST',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const ToggleSaveJob = requestData => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.post(
        `/save-candidate/`,
        requestData,
      );
      // console.log(response);
      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);

      dispatch({type: 'JOB_SAVED_SUCCESSFULLY', payload: requestData.job});
      console.log('requestData.job', requestData.job);

      dispatch(GetSavedJobs(requestData.recruiter_id));

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
        type: 'JOB_SAVED_UNSUCCESSFULLY',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetSavedJobs = recruiter_id  => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.get(
        `/save-candidate/${recruiter_id }/`,
      );
      // console.log(
      //   '****************************job-saved response***************************',
      // );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'JOB_SAVED_SUCCESS', payload: data});
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
        type: 'JOB_SAVED_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const GetReviewData = user_id  => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.get(
        `reviews/${user_id}/`,
      );
      // console.log(
      //   '****************************job-saved response***************************',
      // );

      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);
      // console.log(data);

      dispatch({type: 'CANDIDATE_REVIEW_SAVED_SUCCESS', payload: data});
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
        type: 'CANDIDATE_REVIEW_SAVED_UNSUCCESS',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const AddReview = requestData => async dispatch => {
    dispatch({type: 'LOADING', payload: true});

    try {
      const response = await instance.post(
        `reviews/`,
        requestData,
      );
      // console.log(response);
      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);

      dispatch({type: 'REVIEW_ADDED_SUCCESSFULLY', payload: requestData.job});
      console.log('requestData.job', requestData.job);

      dispatch(GetSavedJobs(requestData.recruiter_id));

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
        type: 'REVIEW_ADDED_UNSUCCESSFULLY',
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
    GetJobDetails,
    ToggleJobStatus,
    GetJobApplications,
    GetJobInvitation,
    ApplicationJobStatus,
    SendInvitation,
    toggleshortlistUser,
    GetUserShortlistedList,
    ToggleSaveJob,
    GetSavedJobs,
    GetReviewData,
    AddReview
  };
};

export default JobViewController;
