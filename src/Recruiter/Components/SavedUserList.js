import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobViewController from '../RecruiterRedux/Action/JobViewController';
import UserCard from '../../Constant/UserCard';
import {colors} from '../../Global_CSS/TheamColors';

const {width} = Dimensions.get('window'); // Get the screen width

const SavedJobScreen = ({route}) => {
  const {jobId} = route.params;
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const {GetSavedUser} = JobViewController();
  const {SavedUsers, isLoading, SavedUsersPagination} = useSelector(
    state => state.job,
  );
  const isFocus = useIsFocused();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const recruiter_id = await AsyncStorage.getItem('user_data');
        if (recruiter_id) {
          setId(recruiter_id);
          dispatch(GetSavedUser(recruiter_id, jobId, 1));
        }
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    if (isFocus) {
      getUserData();
    }
  }, [isFocus, dispatch]);
  // console.log('SavedUsers', SavedUsers);

  const loadMoreUsers = () => {
    if (!isLoading && id && SavedUsersPagination?.next_page_number != null) {
      dispatch(GetSavedUser(id, jobId, SavedUsersPagination.next_page_number));
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={SavedUsers}
        keyExtractor={(item, index) => `${item.id || index}`}
        renderItem={({item, index}) => (
          <UserCard
            item={item}
            jobId={jobId}
            page_name={'home'}
            index={index}
          />
        )}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" /> : null
        }
      />
      {/* <ScrollView>
        {SavedUsers && SavedUsers?.length > 0
          ? SavedUsers?.map((item, index) => (
              <UserCard
                key={item.id || index}
                item={item}
                jobId={jobId}
                page_name={'home'}
              />
            ))
          : null}
      </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
  },
  cardContent: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobTitleContainer: {
    width: width * 0.78,
  },
  bookmarkIconContainer: {
    width: width * 0.2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blackText,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
  },
  detailsText: {
    fontSize: 12,
    color: colors.blackText,
    marginLeft: 6,
  },
  detailscompanytext: {
    fontSize: 10,
    color: colors.blackText,
  },
  containerData: {
    flexDirection: 'row',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsalary: {
    gap: 8,
    flexDirection: 'row',
    marginLeft: 12,
    alignItems: 'center',
  },
  innerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  iconMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyDetail: {
    flexDirection: 'column',
  },
  companyMaincontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    marginRight: 8,
  },
  companyText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 2,
  },
  companyReview: {
    fontSize: 12,
    color: 'gray',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: 4,
  },
  companyDate: {
    fontSize: 12,
    alignItems: 'center',
    color: 'gray',
  },
});

export default SavedJobScreen;
