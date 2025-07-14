import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ModalContainer } from './ModalContainer';
import { FormField } from './FormField';
import { ActionButtons } from './ActionButtons';
import { useFormState } from '../hooks/useFormState';
import { validateDescription, createReportData } from '../utils/formValidation';
import { createModalStyles } from '../styles/modalStyles';

interface ReportFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (reportData: ReportData) => void;
  reportType: {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
  } | null;
}

interface ReportData {
  type: string;
  description: string;
  steps?: string;
  idiomId?: string;
  language?: string;
  expectedResult?: string;
  actualResult?: string;
  deviceInfo?: string;
}

const ReportForm = ({
  isVisible,
  onClose,
  onSubmit,
  reportType,
}: ReportFormProps) => {
  const { colors } = useTheme();
  const styles = createModalStyles(colors);

  const form = useFormState({
    description: '',
    steps: '',
    idiomId: '',
    language: '',
    expectedResult: '',
    actualResult: '',
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!validateDescription(form.values.description)) {
      return;
    }

    const reportData = createReportData(
      reportType?.id || '',
      form.values.description,
      {
        steps: form.values.steps,
        idiomId: form.values.idiomId,
        language: form.values.language,
        expectedResult: form.values.expectedResult,
        actualResult: form.values.actualResult,
      },
    );

    onSubmit(reportData as ReportData);
    form.reset();
  };

  const getFormFields = () => {
    if (!reportType) return [];

    switch (reportType.id) {
      case 'translation-issue':
        return [
          {
            key: 'idiomId',
            label: 'Which idiom has the issue?',
            placeholder: 'Enter the idiom text or describe which one',
            multiline: false,
          },
          {
            key: 'expectedResult',
            label: 'What should the correct translation be?',
            placeholder: 'Enter the correct translation',
            multiline: true,
          },
        ];

      case 'app-issue':
        return [
          {
            key: 'actualResult',
            label: 'What happened?',
            placeholder:
              'Describe what went wrong (e.g., app crashed, button not working, etc.)',
            multiline: true,
          },
        ];

      default:
        return [];
    }
  };

  if (!isVisible || !reportType) return null;

  const formFields = getFormFields();

  return (
    <ModalContainer
      isVisible={isVisible}
      onClose={handleClose}
      zIndex={10001}
      keyboardAdjustment={{
        translateY: -120,
        maxHeight: '70%',
      }}
    >
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons
            name={reportType.icon}
            size={24}
            color={colors.text}
            style={{ marginRight: 12 }}
          />
          <Text
            style={[styles.headerTitle, { fontSize: 18 }]}
            numberOfLines={2}
          >
            {reportType.title}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FormField
          label="Description"
          value={form.values.description}
          onChangeText={form.getField('description').setter}
          placeholder="Describe the issue in detail..."
          multiline
          required
        />

        {formFields.map((field) => (
          <FormField
            key={field.key}
            label={field.label}
            value={form.values[field.key as keyof typeof form.values]}
            onChangeText={
              form.getField(field.key as keyof typeof form.values).setter
            }
            placeholder={field.placeholder}
            multiline={field.multiline}
          />
        ))}
      </ScrollView>

      <ActionButtons
        onCancel={handleClose}
        onSubmit={handleSubmit}
        submitText="Submit Report"
      />
    </ModalContainer>
  );
};

export default ReportForm;
