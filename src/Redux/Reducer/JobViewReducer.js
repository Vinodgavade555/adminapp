const initialState = {
  JobApplications: [],
  JobDetails: null, // Add this state to store job details
  ApplyJob: null,
  HomeData:null,
  JobList: [],
  profiledata:null,
  error: null,
  isLoading: false, // Track loading for any API request
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    // Loading state
    case 'LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    // Job Applications Success
    case 'JOB_APPLICATION_SUCCESS':
      return {
        ...state,
        JobApplications: action.payload,
        error: null,
      };

    // Job Applications Failure
    case 'JOB_APPLICATION_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    // Job Details Success
    case 'JOB_DETAILS_SUCCESS':
      return {
        ...state,
        JobDetails: action.payload, // Store job details in the state
        error: null,
      };

    // Job Details Failure
    case 'JOB_DETAILS_FAILURE':
      return {
        ...state,
        error: action.payload.error, // Store the error message for job details
      };
    //job Apply Success
    case 'JOB_APPLIED_SUCCESSFULLY':
      return {
        ...state,
        error: null,
      };

    // Job Apply Failure
    case 'JOB_APPLIED_FAILURE':
      return {
        ...state,
        error: action.payload.error, // Store the error message for job details
      };

    //homedata success
    case 'JOB_HOMEDATA_SUCCESS':
      return {
        ...state,
        HomeData: action.payload,
        error: null,
      };

    // Homedata Failure
    case 'JOB_HOMEDATA_FAILURE':
      return {
        ...state,
        error: action.payload.error, // Store the error message for job details
      };

    //Job List successfull
    case 'JOB_LIST_SUCCESS':
      return {
        ...state,
        JobList: action.payload,
        error: null,
      };

    //Job List successfull
    case 'JOB_LIST_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

        //profiledata successfull
    case 'PROFILE_DATA_SUCCESS':
      return {
        ...state,
        profiledata: action.payload,
        error: null,
      };

    //profiledata failure
    case 'PROFILE_DATA_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };


    default:
      return state;
  }
};

export default jobReducer;
