import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createModalStyles } from '../styles/modalStyles';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  style?: any;
}

export const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  required = false,
  autoFocus = false,
  style,
}: FormFieldProps) => {
  const { colors } = useTheme();
  const styles = createModalStyles(colors);

  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && ' *'}
      </Text>
      <TextInput
        style={[
          styles.inputField,
          {
            minHeight: multiline ? 80 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
      />
    </View>
  );
};
