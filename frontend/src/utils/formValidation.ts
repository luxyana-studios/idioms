import { Alert } from 'react-native';

export const validateRequired = (value: string, fieldName: string): boolean => {
  if (!value.trim()) {
    Alert.alert(
      'Missing Information',
      `Please provide ${fieldName.toLowerCase()}.`,
    );
    return false;
  }
  return true;
};

export const validateDescription = (description: string): boolean => {
  return validateRequired(description, 'a description of the issue');
};

export const validateText = (
  text: string,
  context: string = 'something',
): boolean => {
  if (!text.trim()) {
    Alert.alert(
      'Missing Information',
      `Please write ${context} before submitting.`,
    );
    return false;
  }
  return true;
};

export const createReportData = (
  reportTypeId: string,
  description: string,
  additionalFields: Record<string, string> = {},
) => {
  const reportData: Record<string, any> = {
    type: reportTypeId,
    description: description.trim(),
    deviceInfo: `Platform: Mobile App, Date: ${new Date().toISOString()}`,
  };

  Object.entries(additionalFields).forEach(([key, value]) => {
    if (value.trim()) {
      reportData[key] = value.trim();
    }
  });

  return reportData;
};
