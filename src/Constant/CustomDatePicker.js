import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import profileStyle from '../Screens/UserProfile/ProfileStyle';

const ReusableDatePicker = ({label, value, onChange, error, touched}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate); // Pass the raw date to the parent
    }
  };

  // Format date using moment
  const formattedDate = value
    ? moment(value).format('YYYY-MM-DD') // Format as YYYY-MM-DD
    : 'Select Date';

  return (
    <View style={styles.dateContainer}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        accessible={true}
        accessibilityLabel={`Select ${label}`}>
        <TextInput
          style={styles.inputBox}
          label={label}
          mode="outlined"
          value={formattedDate}
          textColor="#333"
          outlineColor="lightgray"
          activeOutlineColor="gray"
          editable={false}
        />
        {touched && error && <Text style={profileStyle.error}>{error}</Text>}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    marginVertical: 8,
  },
  inputBox: {
    backgroundColor: '#fff',
  },
});

export default ReusableDatePicker;
