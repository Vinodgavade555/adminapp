const initialState = {
  JobList: [],
  JobSeekerList: [],
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

    //Job List
    case 'JOB_LIST_SUCCESS':
      return {
        ...state,
        JobList: action.payload,
        error: null,
      };

    case 'JOB_LIST_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    // Job Seeker List
    case 'APPLIED_JOB_SEEKER_LIST_SUCCESS':
      return {
        ...state,
        JobSeekerList: action.payload,
        error: null,
      };

    case 'APPLIED_JOB_SEEKER_LIST_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export default jobReducer;
