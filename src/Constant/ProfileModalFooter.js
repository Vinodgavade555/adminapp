import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import GlobalStyle from '../Global_CSS/GlobalStyle';

const ModalFooter = ({
  onPress,
  onCancel,
  onDelete,
  showDelete = false,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
}) => (
  <View style={styles.modalFooter}>
    <View style={styles.modalButtonContainer}>
      <Button onPress={onPress} labelStyle={styles.saveLabelStyle}>
        {saveLabel}
      </Button>
      <Button onPress={onCancel} labelStyle={styles.cancelLabelStyle}>
        {cancelLabel}
      </Button>
    </View>
    {showDelete && (
      <IconButton
        icon="delete"
        iconColor="#ff0000"
        size={24}
        onPress={onDelete}
        style={styles.iconButtonStyle}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  modalFooter: {
    borderTopColor: 'lightgray',
    // borderTopWidth: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  saveLabelStyle: {
    color: '#ffffff',
    backgroundColor: '#00334d',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  cancelLabelStyle: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: 8,
    flex: 1, // Ensure it fills available space to prevent cramping
  },
  iconButtonStyle: {
    marginLeft: 8,
  },
});

export default ModalFooter;
