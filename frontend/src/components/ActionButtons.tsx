import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createModalStyles } from '../styles/modalStyles';

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText?: string;
  submitDisabled?: boolean;
}

export const ActionButtons = ({
  onCancel,
  onSubmit,
  cancelText = 'Cancel',
  submitText = 'Submit',
  submitDisabled = false,
}: ActionButtonsProps) => {
  const { colors } = useTheme();
  const styles = createModalStyles(colors);

  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        onPress={onCancel}
        style={styles.cancelButton}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelButtonText}>{cancelText}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSubmit}
        style={[styles.submitButton, submitDisabled && { opacity: 0.5 }]}
        activeOpacity={0.8}
        disabled={submitDisabled}
      >
        <Text style={styles.submitButtonText}>{submitText}</Text>
      </TouchableOpacity>
    </View>
  );
};
