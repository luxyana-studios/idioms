import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { MotiView } from 'moti';
import { useState } from 'react';
import { ModalContainer } from './ModalContainer';
import { FormField } from './FormField';
import { ActionButtons } from './ActionButtons';
import { validateText } from '../utils/formValidation';
import { createModalStyles } from '../styles/modalStyles';

type IoniconsName = keyof typeof Ionicons.glyphMap;

export interface ReportOption {
  id: string;
  title: string;
  icon: IoniconsName;
}

interface ReportModalProps {
  isVisible: boolean;
  onClose: () => void;
  onReportSelected: (reportType: string) => void;
  onDetailedReportSelected: (reportOption: ReportOption) => void;
}

const ReportModal = ({
  isVisible,
  onClose,
  onReportSelected,
  onDetailedReportSelected,
}: ReportModalProps) => {
  const { colors } = useTheme();
  const styles = createModalStyles(colors);
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ReportOption | null>(
    null,
  );
  const [inputText, setInputText] = useState('');

  const detailedReportTypes = ['translation-issue', 'app-issue'];

  const simpleTextTypes = ['feature-request', 'other'];

  const resetState = () => {
    setShowTextInput(false);
    setSelectedOption(null);
    setInputText('');
  };

  const handleOptionPress = (option: ReportOption) => {
    if (detailedReportTypes.includes(option.id)) {
      onDetailedReportSelected(option);
    } else if (simpleTextTypes.includes(option.id)) {
      setSelectedOption(option);
      setShowTextInput(true);
    } else {
      onReportSelected(option.title);
    }
  };

  const handleTextInputSubmit = () => {
    if (!validateText(inputText)) {
      return;
    }

    const reportWithText = `${selectedOption?.title}: ${inputText.trim()}`;
    onReportSelected(reportWithText);
    resetState();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleTextInputCancel = () => {
    resetState();
  };

  const reportOptions: ReportOption[] = [
    {
      id: 'translation-issue',
      title: 'Translation Error',
      icon: 'language-outline',
    },
    {
      id: 'app-issue',
      title: 'App Bug/Crash',
      icon: 'bug-outline',
    },
    {
      id: 'content-error',
      title: 'Grammar/Spelling Error',
      icon: 'document-text-outline',
    },
    {
      id: 'ui-issue',
      title: 'Display Problem',
      icon: 'phone-portrait-outline',
    },
    {
      id: 'performance',
      title: 'App is Slow',
      icon: 'speedometer-outline',
    },
    {
      id: 'data-sync',
      title: 'Data Not Saving',
      icon: 'cloud-offline-outline',
    },
    {
      id: 'feature-request',
      title: 'Suggest a Feature',
      icon: 'bulb-outline',
    },
    {
      id: 'other',
      title: 'Other Issue',
      icon: 'help-circle-outline',
    },
  ];

  if (!isVisible) return null;

  return (
    <ModalContainer
      isVisible={isVisible}
      onClose={handleClose}
      zIndex={10000}
      keyboardAdjustment={{
        translateY: -150,
        maxHeight: '60%',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Report App Issue</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {reportOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleOptionPress(option)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 12,
              borderBottomWidth: index < reportOptions.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
              borderRadius: 8,
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={option.icon}
              size={22}
              color={colors.text}
              style={{ marginRight: 16 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                }}
              >
                {option.title}
              </Text>
              {detailedReportTypes.includes(option.id) && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Requires details
                </Text>
              )}
              {simpleTextTypes.includes(option.id) && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Add description
                </Text>
              )}
            </View>
            {(detailedReportTypes.includes(option.id) ||
              simpleTextTypes.includes(option.id)) && (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textSecondary}
              />
            )}
          </TouchableOpacity>
        ))}

        {showTextInput && selectedOption && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ type: 'timing', duration: 300 }}
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons
                name={selectedOption.icon}
                size={20}
                color={colors.text}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                  flex: 1,
                }}
              >
                {selectedOption.title}
              </Text>
            </View>

            <FormField
              label=""
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                selectedOption.id === 'feature-request'
                  ? 'Describe the feature you would like to see...'
                  : 'Describe your issue or feedback...'
              }
              multiline
              autoFocus
              style={{ marginBottom: 12 }}
            />

            <ActionButtons
              onCancel={handleTextInputCancel}
              onSubmit={handleTextInputSubmit}
              cancelText="Cancel"
              submitText="Send"
            />
          </MotiView>
        )}
      </ScrollView>
    </ModalContainer>
  );
};

export default ReportModal;
