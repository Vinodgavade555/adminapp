const initialState = {
  JobList: [],
  JobListPagination: {},
  JobSeekerList: [],
  JobDetails:[],
  HomeData: [],
  JobApplications:[],
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
        JobListPagination: {
          count: action.payload.count,
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          items_per_page: action.payload.items_per_page,
          previous: action.payload.previous,
          next_page_number: action.payload.next_page_number,
          previous_page_number: action.payload.previous_page_number,
        },
        JobList: [
          ...state.JobList,
          ...action.payload.results.filter(
            newJob =>
              !state.JobList.some(existingJob => existingJob.id === newJob.id),
          ),
        ],
        error: null,
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

      case 'TOGGLE_JOB_STATUS_SUCCESS':
      return {
        ...state,
        // JobDetails: action.payload,  // Updated job details after toggling status
      };
    case 'TOGGLE_JOB_STATUS_FAILURE':
      return {
        ...state,
        error: action.payload.error,
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

    //Home data
    case 'HOME_DATA_SUCCESS':
      return {
        ...state,
        HomeData: action.payload,
        error: null,
      };

    case 'HOME_DATA_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };
      
      // Job Applications Success 
    case 'JOB_APPLICATIONS_SUCCESS':
      return {
        ...state,
        JobApplications: action.payload, 
        error: null,
      };

    // Job Applications Failure
    case 'JOB_APPLICATIONS_FAILURE':
      return {
        ...state,
        error: action.payload.error, 
      };

    default:
      return state;
  }
};

export default jobReducer;
