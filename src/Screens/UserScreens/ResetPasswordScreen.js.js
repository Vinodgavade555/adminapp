import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, Alert} from 'react-native';
import {TextInput, Button, IconButton} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../Global_CSS/TheamColors';
import GlobalStyle from '../../Global_CSS/GlobalStyle';
const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isConfermPasswordVisible, setConfermPasswordVisibility] =
    useState(false);

  const PasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleSubmit = () => {
    Alert.alert('Password Changed successfully');
    navigation.navigate('LoginScreen');
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Set New Password</Text> */}

      <Formik
        initialValues={{password: '', confirmPassword: ''}}
        validationSchema={PasswordSchema}
        onSubmit={values => handleSubmit(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <Image
              style={styles.imageContainer}
              source={require('../../Assets/CompanyLogo/flexhire-logo.png')}
            />
            <Text style={styles.headingText}>Set New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                mode="outlined"
                label="New Password"
                textColor="black"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={[styles.input, styles.passwordInput]}
                activeOutlineColor="lightgrey"
                error={!!errors.password}
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
                style={[styles.input, styles.passwordInput]}
                mode="outlined"
                label="Confirm Password"
                selectionColor="black"
                textColor="black"
                secureTextEntry={!isConfermPasswordVisible}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                activeOutlineColor="lightgrey"
                error={!!errors.confirmPassword}
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
                Submit
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
  formContainer: {
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
  input: {
    backgroundColor: '#ffffff',
  },
  passwordContainer: {
    height: 48,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    color: colors.primary,
    position: 'absolute',
    right: 10,
    top: 1,
    alignSelf: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
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
    marginHorizontal: 32,
    marginTop: 6,
  },
});

export default ResetPasswordScreen;
