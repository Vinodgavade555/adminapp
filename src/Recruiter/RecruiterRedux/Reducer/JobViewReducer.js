const initialState = {
  JobList: [],
  JobListPagination: {},
  JobSeekerList: [],
  JobDetails: [],
  HomeData: [],
  JobApplications: null,
  JobInvitations: [],
  JobInvitationsPagination: {},
  shortlistUser: null,
  UserShortlitedList: [],
  UserShortlitedListPagination: {},
  CandidateReview: null,
  FilteredUsers: [],
  FilteredUsersPagination: {},
  FilterUserMaster: [],
  SaveUser: [],
  SavedUsers: [],
  SavedUsersPagination: {},
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

    case 'APPLICATION_JOB_STATUS_SUCCESS':
      return {
        ...state,
        // JobDetails: action.payload,  // Updated job details after toggling status
      };
    case 'APPLICATION_JOB_STATUS_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'JOB_INVITATION_SUCCESS':
      // console.log(
      //   '---------------------JobInvitations Before-----------------------',
      //   state.JobInvitations,
      // );
      // console.log(
      //   '---------------------Payload-----------------------',
      //   JSON.stringify(action.payload, null, 2),
      // );
      return {
        ...state,
        JobInvitationsPagination: {
          count: action.payload.count,
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          items_per_page: action.payload.items_per_page,
          previous: action.payload.previous,
          next_page_number: action.payload.next_page_number,
          previous_page_number: action.payload.previous_page_number,
        },
        JobInvitations:
          parseInt(action.payload?.current_page) > 1
            ? [
                ...state.JobInvitations,
                ...action.payload.results.filter(
                  newUser =>
                    !state.JobInvitations.some(
                      existinguser => existinguser.id === newUser.id,
                    ),
                ),
              ]
            : action?.payload?.results || [],
        error: null,
      };

    // Job Applications Failure
    case 'JOB_INVITATION_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'SENDINVITATION_SUCCESS':
      return {
        ...state,
        error: null,
      };

    // Job Applications Failure
    case 'SENDINVITATION_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    // Job Shortlist Success
    case 'TOGGLE_TO_SHORTLIST_SUCCESS': {
      // console.log(
      //   '--------------------------------------------',
      //   state.JobInvitations,
      // );

      return {
        ...state,
        JobApplications: {
          ...state.JobApplications,
          matching_applies: state.JobApplications.matching_applies.map(
            application => {
              // Match based on job_id and user_id
              if (
                application.job === action.payload.job_id &&
                application.user_id?.id === action.payload.user_id
              ) {
                return {
                  ...application,
                  user_id: {
                    ...application.user_id, // Copy the existing user_id object
                    is_shortlisted: !application.user_id.is_shortlisted, // Toggle the is_shortlisted field
                  },
                };
              }
              return application; // Leave unchanged if no match
            },
          ),
        },

        JobInvitations: state.JobInvitations.map(application =>
          application.id === action.payload.user_id // Assuming user_id corresponds to the application's ID
            ? {
                ...application,
                // Toggle the is_shortlisted value
                is_shortlisted: !application.is_shortlisted,
              }
            : application,
        ),

        error: null,
      };
    }

    // Job Shortlist Failure
    case 'TOGGLE_TO_SHORTLIST_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'USER_SHORTLIST_LIST_SUCCESS':
      return {
        ...state,
        UserShortlitedList: action.payload,
        loading: false,
      };

    case 'USER_SHORTLIST_LIST_FAILURE':
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    //Save users
    case 'USER_SAVED_SUCCESSFULLY':
      return {
        ...state,
        SaveUser: action.payload, // Store job details in the state
        error: null,
      };
    case 'USER_SAVED_UNSUCCESSFULLY':
      return {
        ...state,
        error: action.payload.error, // Store the error message for job details
      };

    //get saves users
    case 'GET_USER_SAVED_SUCCESS':
      console.log(
        '---------------------SavedUsers Before-----------------------',
        state.SavedUsers,
      );

      return {
        ...state,
        SavedUsersPagination: {
          count: action.payload.count,
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          items_per_page: action.payload.items_per_page,
          previous: action.payload.previous,
          next_page_number: action.payload.next_page_number,
          previous_page_number: action.payload.previous_page_number,
        },
        SavedUsers:
          parseInt(action.payload?.current_page) > 1
            ? [
                ...state.SavedUsers,
                ...action.payload.results.filter(
                  newUser =>
                    !state.SavedUsers.some(
                      existingUser =>
                        existingUser.user_id.id === newUser.user_id.id,
                    ),
                ),
              ]
            : action?.payload?.results || [], // Replace if it's the first page
        error: null,
      };

    case 'GET_USER_SAVED_FAILURE':
      return {
        ...state,
        error: action.payload.error, // Store the error message for job details
      };

    case 'CANDIDATE_REVIEW_SAVED_SUCCESS':
      return {
        ...state,
        CandidateReview: action.payload, // Store job details in the state
        error: null,
      };

    case 'CANDIDATE_REVIEW_SAVED_UNSUCCESS':
      return {
        ...state,
        error: action.payload.error, // Store the error message for job details
      };
    case 'REVIEW_ADDED_SUCCESSFULLY':
      return {
        ...state,
        error: null,
      };

    // Job Applications Failure
    case 'REVIEW_ADDED_UNSUCCESSFULLY':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'DELETE_REVIEW_SUCCESS': {
      return {
        ...state,
        CandidateReview: {
          ...state.CandidateReview,
          results: state.CandidateReview.results.filter(
            review => review.id !== action.payload,
          ),
        },
      };
    }
    case 'FILTER_USER_SUCCESS':
      return {
        ...state,
        FilteredUsersPagination: {
          count: action.payload.count,
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          items_per_page: action.payload.items_per_page,
          previous: action.payload.previous,
          next_page_number: action.payload.next_page_number,
          previous_page_number: action.payload.previous_page_number,
        },

        FilteredUsers:
          parseInt(action.payload?.current_page) > 1
            ? [
                ...state.FilteredUsers,
                ...action.payload.results.filter(
                  newUser =>
                    !state.FilteredUsers.some(
                      existingUser => existingUser.id === newUser.id,
                    ),
                ),
              ]
            : action?.payload?.results || [],

        // FilteredUsers: action.payload,
        error: null,
      };

    // Job Applications Failure
    case 'FILTER_USER_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'FILTER_USER_MASTER_SUCCESS':
      return {
        ...state,
        FilterUserMaster: action.payload, // Store job details in the state
        error: null,
      };

    case 'FILTER_USER_MASTER_FAILURE':
      return {
        ...state,
        error: action.payload.error, // Store the error message for job details
      };

    default:
      return state;
  }
};

export default jobReducer;
