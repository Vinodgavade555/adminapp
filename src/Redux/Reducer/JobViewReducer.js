const initialState = {
  JobList: [],

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
    // Search Job List

    default:
      return state;
  }
};

export default jobReducer;
