// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Alert,
  BackHandler,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, Checkbox, IconButton} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import GlobalStyle from '../../Global_CSS/GlobalStyle';
import {colors} from '../../Global_CSS/TheamColors';
import ReusableTextInput from '../../Constant/CustomTextInput';
import AuthViewController from '../../Redux/Action/AuthViewController';
import {useDispatch} from 'react-redux';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const [ispasswordVisible, setpasswordVisibility] = useState(false);
  const {login} = AuthViewController();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   handleLoadingCredentials();
  // }, []);

  // const handleLoadingCredentials = async () => {
  //   try {
  //     const userdata = await AsyncStorage.getItem('UserData');
  //     if (userdata) {
  //       Alert.alert('Welcome ', userdata);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Unable to load credentials');
  //   }
  // };

  const loginSchema = Yup.object().shape({
    identifier: Yup.string()
      .test(
        'identifier',
        'Please enter a valid email or phone number',
        value =>
          Yup.string().email().isValidSync(value) || /^[0-9]{10}$/.test(value),
      )
      .required('Email or phone number is required'),
    password: Yup.string()
      .min(8, 'password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      )
      .required('password is required'),
  });

  const handleSubmit = async values => {
    try {
      const UserData = {
        identifier: values.identifier,
        password: values.password,
      };
      dispatch(login(UserData));

      // await AsyncStorage.setItem('userdata', JSON.stringify(UserData));
      // navigation.navigate('DefaultScreen');
    } catch (error) {
      Alert.alert('Error saving credentials');
    }
  };

  const HandleForgotpassword = () => {
    navigation.navigate('ForgotpasswordScreen');
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  return (
    <SafeAreaView style={styles.maincontainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.FormContainer}>
          <Text style={styles.heading}>Admin</Text>
          <Text style={styles.Subheading}>Login</Text>
          <Formik
            initialValues={{identifier: '', password: ''}}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}>
            {({handleChange, values, handleSubmit}) => (
              <>
                <View>
                  <ReusableTextInput
                    name="emailOrPhone"
                    label="Email/Mobile Number"
                    value={values.identifier}
                    onChangeText={handleChange('identifier')}
                  />
                  <View style={styles.passwordContainer}>
                    <View flex={1}>
                      <ReusableTextInput
                        name="password"
                        label="Password"
                        secureTextEntry={!ispasswordVisible}
                        value={values.password}
                        onChangeText={handleChange('password')}
                      />
                    </View>
                    <IconButton
                      icon={ispasswordVisible ? 'eye-off' : 'eye'}
                      color={colors.primary}
                      size={26}
                      onPress={() => setpasswordVisibility(!ispasswordVisible)}
                      style={styles.eyeIcon}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <View flexDirection="row" alignItems="center">
                      <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(!checked)}
                        color={colors.primary}
                      />
                      <Text style={styles.checkboxtext1}>Remember me</Text>
                    </View>
                    <TouchableOpacity onPress={HandleForgotpassword}>
                      <Text style={styles.checkboxtext2}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      labelStyle={GlobalStyle.labelStyle}
                      onPress={handleSubmit}>
                      Login
                    </Button>
                  </View>
                </View>
              </>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  FormContainer: {
    margin: 12,
  },

  heading: {
    marginVertical: 12,
    fontSize: 56,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  Subheading: {
    marginVertical: 12,
    fontSize: 32,
    color: colors.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  passwordContainer: {
    flexDirection: 'row',
  },

  eyeIcon: {
    color: colors.primary,
    top: 16,
    position: 'absolute',
    right: 10,
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxtext1: {
    color: 'black',
    fontSize: 16,
  },
  checkboxtext2: {
    color: '#51b8e1',
    fontSize: 14,
  },
  buttonContainer: {
    marginVertical: 12,
  },

  socialContainer_Heading: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 12,
    paddingHorizontal: 36,
  },
  sociallineContainer: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  socialtextContainer: {
    marginHorizontal: 14,
    fontSize: 16,
    color: 'gray',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 100,
  },
  socialImages: {
    marginHorizontal: 12,
    width: 28,
    height: 28,
  },
  signupContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  signupText1: {
    fontSize: 16,
    color: 'black',
    alignContent: 'center',
  },
  signupText2: {
    marginLeft: 4,
    fontSize: 14,
    color: '#51b8e1',
    alignContent: 'center',
  },
});

export default LoginScreen;
