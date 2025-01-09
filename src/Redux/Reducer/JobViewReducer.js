const initialState = {
  JobList: [],
  JobListPagination: {},
  JobSeekerList: [],
  HomeData: [],
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

    default:
      return state;
  }
};

export default jobReducer;
