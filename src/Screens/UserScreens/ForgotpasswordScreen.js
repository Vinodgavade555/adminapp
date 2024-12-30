import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import GlobalStyle from '../../Global_CSS/GlobalStyle';
const ForgotpasswordScreen = () => {
  const navigation = useNavigation();
  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
  });

  const handleSendOtp = values => {
    navigation.navigate('OtpVerificationScreen', {email: values.email});
  };
  return (
    <SafeAreaView style={styles.maincontainer}>
      <Formik
        initialValues={{email: ''}}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSendOtp}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <View style={styles.Formcontainer}>
            <Image
              style={styles.imageContainer}
              source={require('../../Assets/CompanyLogo/flexhire-logo.png')}
            />
            <Text style={styles.headingText}>Forgot password</Text>
            <TextInput
              mode="outlined"
              style={styles.textarea}
              label="Enter User Email"
              textColor="black"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email')}
              activeOutlineColor="lightgray"
              error={!!errors.email}
            />
            {errors.email && touched.email ? (
              <Text style={GlobalStyle.errorText}>{errors.email}</Text>
            ) : null}
            <View style={styles.buttonContainer}>
              <Button
                labelStyle={GlobalStyle.labelStyle}
                onPress={handleSubmit}>
                Send OTP
              </Button>
            </View>
          </View>
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
  Formcontainer: {
    margin: 12,
  },
  imageContainer: {
    width: 250,
    height: 130,
    alignSelf: 'center',
    marginVertical: 20,
  },
  headingText: {
    marginVertical: 20,
    fontSize: 32,
    color: '#cc4400',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textarea: {
    marginVertical: 12,
    backgroundColor: 'white',
    width: '100%',
    alignSelf: 'center',
    height: 48,
  },
  buttonContainer: {
    marginVertical: 12,
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
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default ForgotpasswordScreen;
