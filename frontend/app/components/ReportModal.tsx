import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { MotiView } from 'moti';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface ReportOption {
  id: string;
  title: string;
  icon: IoniconsName;
}

interface ReportModalProps {
  isVisible: boolean;
  onClose: () => void;
  onReportSelected: (reportType: string) => void;
}

const ReportModal = ({
  isVisible,
  onClose,
  onReportSelected,
}: ReportModalProps) => {
  const { colors } = useTheme();

  const reportOptions: ReportOption[] = [
    {
      id: 'translation-issue',
      title: 'Translation issue',
      icon: 'language-outline',
    },
    {
      id: 'content-error',
      title: 'Content error',
      icon: 'document-outline',
    },
    {
      id: 'app-issue',
      title: 'App not working properly',
      icon: 'bug-outline',
    },
    {
      id: 'feature-request',
      title: 'Feature request',
      icon: 'bulb-outline',
    },
    {
      id: 'general-feedback',
      title: 'General feedback',
      icon: 'chatbubble-outline',
    },
    {
      id: 'other',
      title: 'Other issue',
      icon: 'help-circle-outline',
    },
  ];

  if (!isVisible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
      }}
    >
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        activeOpacity={1}
        onPress={onClose}
      />

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          minWidth: 280,
          maxWidth: 320,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 20,
          borderWidth: 1,
          borderColor: colors.border,
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingBottom: 8,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
            }}
          >
            Report Issue
          </Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {reportOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onReportSelected(option.title)}
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
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '500',
                flex: 1,
              }}
            >
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </MotiView>
    </View>
  );
};

export default ReportModal;
