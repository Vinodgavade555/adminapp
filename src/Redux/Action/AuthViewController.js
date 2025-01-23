import {Toast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance, {setAuthToken} from '../../Services/baseAPI';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import { useContext } from 'react';
import { UserContext } from '../../Services/UserContext';
export const BASE_URL = 'http://15.206.149.28/';
const AuthViewController = () => {
  const {userType, setUserType } = useContext(UserContext);

  const navigation = useNavigation();
  const goBackScreen = () => {
    navigation.goBack();
  };
  const checkLoginStatus = () => async dispatch => {
    // console.log('checkLoginStatus called');

    try {
      AsyncStorage.getItem('token').then(token => {
        // console.log('result', token);
        if (token) {
          // console.log('checkLoginStatus', token);
          if (token) {
            setAuthToken(token);
            dispatch({type: 'LOGIN_SUCCESS', payload: {token}}); // Optionally, dispatch user data as well
          }
        } else {
          // props.navigation.navigate('Login');
        }
      }); // Retrieve the token from storage, e.g., AsyncStorage
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const login = requestData => async dispatch => {
    dispatch({type: 'LOADING', payload: true});
    console.log(requestData);

    try {
      const response = await axios.post(
        'http://15.206.149.28/api/employer/login/',
        requestData,
      );

      console.log(
        '****************************login response***************************',
      );
      // console.log(response);
      const {message, user_id, access, refresh} = response.data;
      const jsonString = JSON.stringify(response.data);
      const data = JSON.parse(jsonString);

      // const {access, user_id} = data;
      const decodedToken = jwtDecode(access);
      setUserType(decodedToken?.user_type || '');
      setAuthToken(access); // Set token in axios headers or AsyncStorage
      await AsyncStorage.setItem('user_data', JSON.stringify(user_id));

      dispatch({type: 'LOGIN_SUCCESS', payload: {access, user_id}});

      dispatch({type: 'LOADING', payload: false});
      Toast.show('You are successfully logged in', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        offset: 100,
        animationType: 'slide-in',
      });
      navigation.navigate('DefaultScreen');
    } catch (error) {
      console.log('error_____', error);

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
        type: 'LOGIN_FAILURE',
        payload: {
          error: error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error?.response?.data,
        },
      });
    }
  };

  const logout = () => dispatch => {
    console.log('logout called');
    setAuthToken(null);
    dispatch({type: 'LOGOUT'});
    navigation.navigate('LoginScreen');
  };

  return {
    goBackScreen,
    checkLoginStatus,
    // register,
    login,
    logout,
  };
};

export default AuthViewController;
