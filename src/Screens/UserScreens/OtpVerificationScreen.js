import React from 'react';
import {View, StyleSheet, Text, Image, Alert} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import GlobalStyle from '../../Global_CSS/GlobalStyle';

const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const predefinedOTP = '123456';

  const OTPSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required'),
  });

  const handleOTPSubmit = otp => {
    if (otp === predefinedOTP) {
      setTimeout(() => {
        navigation.navigate('ResetPasswordScreen');
      }, 2000);
    }
  };
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{otp: ''}}
        validationSchema={OTPSchema}
        onSubmit={values => handleOTPSubmit(values.otp)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.FormContainer}>
            <Image
              style={styles.imageContainer}
              source={require('../../Assets/CompanyLogo/flexhire-logo.png')}
            />
            <Text style={styles.title}>Enter OTP</Text>
            <TextInput
              mode="outlined"
              label="OTP"
              keyboardType="numeric"
              value={values.otp}
              onChangeText={handleChange('otp')}
              onBlur={handleBlur('otp')}
              textColor="black"
              maxLength={6}
              style={styles.input}
              activeOutlineColor="lightgray"
              error={!!errors.otp}
            />
            {errors.otp && touched.otp && (
              <Text style={GlobalStyle.errorText}>{errors.otp}</Text>
            )}

            <View style={styles.buttonContainer}>
              <Button labelStyle={GlobalStyle.labelStyle} onPress={handleSubmit}>
                Send OTP
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  FormContainer: {
    margin: 12,
  },
  title: {
    marginVertical: 20,
    fontSize: 32,
    color: '#cc4400',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    width: 250,
    height: 130,
    alignSelf: 'center',
    marginVertical: 20,
  },
  input: {
    alignSelf: 'center',
    marginVertical: 14,
    backgroundColor: '#ffff',
    paddingHorizontal: 14,
    width: '100%',
    height: 48,
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

export default OtpVerificationScreen;
