import React from 'react';
import {TextInput} from 'react-native-paper';
import {useField} from 'formik';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const horizontalMargin = 12 * 2; // Total margin (left + right)

const effectiveWidth = screenWidth - horizontalMargin;

const ReusableTextInput = ({name, label, note, ...props}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <>
      <View style={styles.inputfieldContainer}>
        <TextInput
          label={label}
          style={styles.textarea}
          mode="outlined"
          outlineColor="lightgrey"
          textColor="black"
          activeOutlineColor="lightgrey"
          value={field.value}
          onChangeText={text => helpers.setValue(text)}
          onBlur={() => helpers.setTouched(true)}
          error={meta.touched && meta.error}
          {...props}
        />
        {/* Show error if present, else show note */}
        {meta.touched && meta.error ? (
          <Text style={styles.error}>{meta.error}</Text>
        ) : (
          note && <Text style={styles.note}>{note}</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputfieldContainer: {
    marginVertical: 12,
  },
  textarea: {
    backgroundColor: 'white',
    // width: effectiveWidth,
    // width: '100%',
    height: 48,
    borderColor: 'lightgrey',
  },
  error: {
    color: 'red',
    fontSize: 11,
    marginTop: 4,
  },
  note: {
    color: 'grey',
    fontSize: 11,
    marginTop: 4,
  },
});

export default ReusableTextInput;
