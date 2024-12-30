import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {colors} from '../Global_CSS/TheamColors';

const CustomDataTable = ({columns, data, actions, rowsPerPageOptions}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleChangePage = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getValueFromPath = (object, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], object);
  };

  const handlePhonePress = phone => {
    Linking.openURL(`tel:${phone}`).catch(err =>
      console.error('Error opening phone app:', err),
    );
  };
  const handleEmailPress = email => {
    Linking.openURL(`mailto:${email}`).catch(err =>
      console.error('Error opening email app:', err),
    );
  };

  const renderStatusBadge = status => {
    const badgeStyle = [
      styles.statusBadge,
      status === 'Active'
        ? {color: '#6fcf97'}
        : {color: '#fa976e'},
    ];
    const textStyle = {
      marginTop:8,
      // height: 30,
      color: '#fff',
      fontWeight: 'bold',
paddingVertical:8,
    };

    return (
      <View style={badgeStyle}>
        <Text style={[textStyle,badgeStyle]}>{status}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={styles.headerRow}>
            {columns.map((column, index) => (
              <Text key={index} style={styles.headerCell}>
                {column.header}
              </Text>
            ))}
            {/* {actions?.length > 0 && (
              <Text style={styles.headerCell}>Action</Text>
            )} */}
          </View>

          {/* Table Rows */}
          <ScrollView>
            {getPaginatedData().map((item, rowIndex) => (
              <View
                key={rowIndex}
                style={[
                  styles.row,
                  rowIndex % 2 === 0 && styles.evenRow, // Alternate row colors
                ]}>
                {columns.map((column, colIndex) => (
                  <Text key={colIndex} style={styles.cell}>
                    {column.field === 'candidateDetails.contact.email' ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleEmailPress(getValueFromPath(item, column.field))
                        }>
                        <Text style={styles.emailLink}>
                          {getValueFromPath(item, column.field)}
                        </Text>
                      </TouchableOpacity>
                    ) : column.field === 'candidateDetails.contact.phone' ? (
                      <TouchableOpacity
                        onPress={() =>
                          handlePhonePress(getValueFromPath(item, column.field))
                        }>
                        <Text style={styles.phoneLink}>
                          {getValueFromPath(item, column.field)}
                        </Text>
                      </TouchableOpacity>
                    ) : column.field === 'date' ? (
                      moment(getValueFromPath(item, column.field)).format(
                        'DD MMM YYYY',
                      )
                    ) : column.field === 'status' ? (
                      renderStatusBadge(getValueFromPath(item, column.field))
                    ) : column.field === 'action' && actions ? (
                      actions.map((action, actionIndex) => (
                        <TouchableOpacity
                          key={actionIndex}
                          onPress={() => action.onPress(item)}
                          style={styles.actionButton}>
                          <Text style={styles.actionText}>{action.label}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      getValueFromPath(item, column.field)
                    )}
                  </Text>
                ))}
                {/* {actions?.length > 0 && (
                  <View style={styles.cell}>
                    {actions.map((action, actionIndex) => (
                      <TouchableOpacity
                        key={actionIndex}
                        onPress={() => action.onPress(item)}
                        style={styles.actionButton}>
                        <Text style={styles.actionText}>{action.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )} */}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <View style={styles.rowsPerPageContainer}>
          <Text style={styles.paginationText}>Rows per page:</Text>
          <Picker
            selectedValue={rowsPerPage}
            dropdownIconColor={'orange'}
            style={styles.picker}
            onValueChange={itemValue => {
              setRowsPerPage(itemValue);
              setCurrentPage(1);
            }}>
            {rowsPerPageOptions.map(option => (
              <Picker.Item
                key={option}
                label={`${option}`}
                value={option}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.pageNavigation}>
          <TouchableOpacity
            style={styles.pageButton}
            onPress={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}>
            <Ionicons
              name="chevron-back-outline"
              size={18}
              style={currentPage === 1 ? styles.disabledText : styles.text}
            />
          </TouchableOpacity>
          <Text style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            style={styles.pageButton}
            onPress={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              style={
                currentPage === totalPages ? styles.disabledText : styles.text
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e6f7ff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    height: 60,
    minWidth: 200,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    minWidth: 200,
    width: 200,
    minHeight: 50,
    height: 50,
    // padding:12,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#e6f7ff',
  },
  rowsPerPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    height: 60,
    width: 100,
    marginLeft: 8,
    color: 'orange',
  },
  pageNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButton: {
    marginHorizontal: 10,
    color: 'orange',
  },
  text: {
    color: 'orange',
  },
  disabledText: {
    color: 'gray',
  },
  paginationText: {
    color: '#000',
    fontSize: 14,
  },
  phoneLink: {
    color: colors.secondary,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    marginVertical: 16,
  },
  emailLink: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    marginVertical: 16,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    // backgroundColor: '#e3f0e9',

    borderRadius: 4,
    alignItems: 'center',
  },
  actionText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default CustomDataTable;
