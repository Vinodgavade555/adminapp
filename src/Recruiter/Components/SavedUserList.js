import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../Global_CSS/TheamColors';
import JobViewController from '../RecruiterRedux/Action/JobViewController';
import UserCard from '../../Constant/UserCard';
const {width} = Dimensions.get('window'); // Get the screen width

const SavedJobScreen = ({route}) => {
  const {jobId} = route.params;
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const {GetSavedUser} = JobViewController();
  const {SavedUsers} = useSelector(state => state.job);
  const isFocus = useIsFocused();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const recruiter_id = await AsyncStorage.getItem('user_data'); // Wait for the value to be retrieved
        setId(recruiter_id);
        dispatch(GetSavedUser(recruiter_id, jobId));
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, [isFocus, dispatch]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {SavedUsers?.results && SavedUsers?.results?.length > 0
          ? SavedUsers?.results.map((item, index) => {
              return (
                <UserCard
                  key={item.id || index} // Use unique `id` if available
                  item={item}
                  jobId={jobId}
                  page_name={'home'}
                />
              );
            })
          : null}
      </ScrollView>
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
    resizeMode: 'contain', // Adjusts the image to cover the container uniformly
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

    // textAlign:'right',
  },
});

export default SavedJobScreen;
