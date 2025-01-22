import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmationModal = ({ 
  visible, // Modal visibility
  onClose, // Function to close the modal
  onConfirm, // Function to handle the "Yes" action
  message = "Are you sure?", // Message to display
  title = "Confirm Action" // Optional title
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}
          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                onClose();
              }}
              style={[styles.button, styles.yesButton]}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={[styles.button, styles.noButton]}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  yesButton: {
    backgroundColor: '#4CAF50', // Green for "Yes"
  },
  noButton: {
    backgroundColor: '#FF5252', // Red for "No"
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ConfirmationModal;
