import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button, TextInput, IconButton} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import GlobalStyle from '../../Global_CSS/GlobalStyle';
import {colors} from '../../Global_CSS/TheamColors';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isConfermPasswordVisible, setConfermPasswordVisibility] =
    useState(false);

  const signupSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = values => {
    Alert.alert('Signup Successful', `Welcome, ${values.email}!`);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.maincontainer}>
      <Formik
        initialValues={{
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <ScrollView>
            <View style={styles.formContainer}>
              <Image
                style={styles.loginpng}
                source={require('../../Assets/CompanyLogo/flexhire-logo.png')}
              />
              <Text style={styles.heading}>Signup</Text>

              <TextInput
                style={styles.textarea}
                mode="outlined"
                label="Email"
                activeOutlineColor="lightgray"
                textColor="black"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              {errors.email && touched.email && (
                <Text style={GlobalStyle.errorText}>{errors.email}</Text>
              )}

              <TextInput
                style={styles.textarea}
                mode="outlined"
                label="Mobile Number"
                activeOutlineColor="lightgray"
                textColor="black"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <Text style={GlobalStyle.errorText}>{errors.phoneNumber}</Text>
              )}

              {/* Password Input */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.textarea}
                  mode="outlined"
                  label="Password"
                  activeOutlineColor="lightgray"
                  secureTextEntry={!isPasswordVisible}
                  textColor="black"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <IconButton
                  icon={isPasswordVisible ? 'eye-off' : 'eye'}
                  color="grey"
                  size={26}
                  onPress={() => setPasswordVisibility(!isPasswordVisible)}
                  style={styles.eyeIcon}
                />
              </View>
              {errors.password && touched.password && (
                <Text style={GlobalStyle.errorText}>{errors.password}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.textarea, styles.passwordInput]}
                  mode="outlined"
                  activeOutlineColor="lightgray"
                  label="Confirm Password"
                  secureTextEntry={!isConfermPasswordVisible}
                  textColor="black"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                />
                <IconButton
                  icon={isConfermPasswordVisible ? 'eye-off' : 'eye'}
                  color="grey"
                  size={26}
                  onPress={() =>
                    setConfermPasswordVisibility(!isConfermPasswordVisible)
                  }
                  style={styles.eyeIcon}
                />
              </View>
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={GlobalStyle.errorText}>
                  {errors.confirmPassword}
                </Text>
              )}

              <View style={styles.buttonContainer}>
                <Button
                  labelStyle={GlobalStyle.labelStyle}
                  onPress={handleSubmit}>
                  Signup
                </Button>
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText1}>Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoginScreen')}>
                  <Text style={styles.loginText2}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  loginpng: {
    marginTop: 36,
    width: 240,
    height: 130,
    alignSelf: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#cc4400',
    textAlign: 'center',
    marginVertical: 12,
  },
  formContainer: {
    margin: 12,
  },
  textarea: {
    marginVertical: 12,
    backgroundColor: 'white',
    width: '100%',
    alignSelf: 'center',
    height: 48,
    borderColor: 'lightgrey',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },

  eyeIcon: {
    color: colors.primary,
    top: 16,
    position: 'absolute',
    right: 10,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 18,
  },
  labelStyle: {
    color: '#ffffff',
    backgroundColor: '#407093',
    // backgroundColor: '#1A6F4A',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    height: 48,
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loginText1: {
    fontSize: 15,
    color: 'black',
  },
  loginText2: {
    marginLeft: 4,
    fontSize: 15,
    color: '#51b8e1',
  },
});

export default SignupScreen;
