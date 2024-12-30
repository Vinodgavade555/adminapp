import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../Global_CSS/TheamColors';
import profileStyle from '../Screens/UserProfile/ProfileStyle';
import {Text} from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;
const horizontalMargin = 12 * 2; // Total margin (left + right)
const effectiveWidth = screenWidth - horizontalMargin;

const ReusableDropdown = ({
  options,
  placeholder,
  selectedValue,
  onSelect,
  error, // Validation error from Formik
  touched, // Touched state from Formik
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // Sync with external selectedValue
  useEffect(() => {
    if (selectedValue) {
      const matchedItem = options.find(
        option => option.value === selectedValue,
      );
      setSelectedItem(matchedItem || null); // Set selectedItem if a match is found
    }
  }, [selectedValue, options]);

  const handleSelect = item => {
    setSelectedItem(item);
    onSelect(item);
    setIsFocus(false);
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'gray'}]}
        data={options}
        labelField="label"
        valueField="value"
        search
        searchPlaceholder="Search..."
        inputSearchStyle={styles.inputSearchStyle}
        placeholder={placeholder}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={{color: '#000'}}
        value={selectedItem?.value} // Set the selected value
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => handleSelect(item)}
      />
      {touched && error && <Text style={profileStyle.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 12,
  },
  dropdown: {
    height: 50,
    borderColor: colors.lightgaryText,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#888',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  inputSearchStyle: {
    color: colors.blackText,
  },
});

export default ReusableDropdown;
