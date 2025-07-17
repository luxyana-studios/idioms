import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  feedbackForm: { subject: string; description: string; email: string };
  onSubjectChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onSendFeedback: () => void;
  colors: any;
  theme: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  feedbackForm,
  onSubjectChange,
  onDescriptionChange,
  onEmailChange,
  onSendFeedback,
  colors,
  theme,
}) => (
  <Modal
    visible={visible}
    animationType="none"
    transparent={true}
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 48 : 0}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background + 'CC',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '92%',
            maxWidth: 420,
            backgroundColor: colors.background,
            borderRadius: 24,
            padding: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 16,
            maxHeight: '90%',
          }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row items-center justify-between mb-8 pt-12">
              <Text
                style={{ color: colors.text }}
                className="text-2xl font-bold"
              >
                Send Feedback
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 20,
                  padding: 8,
                }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text
                style={{ color: colors.text }}
                className="text-lg font-semibold mb-3"
              >
                Subject
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 16,
                  color: colors.text,
                  fontSize: 16,
                }}
                placeholder="What's this about?"
                placeholderTextColor={colors.textSecondary}
                value={feedbackForm.subject}
                onChangeText={onSubjectChange}
                maxLength={80}
              />
            </View>

            <View className="mb-6">
              <Text
                style={{ color: colors.text }}
                className="text-lg font-semibold mb-3"
              >
                Message
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 16,
                  color: colors.text,
                  fontSize: 16,
                  minHeight: 120,
                  textAlignVertical: 'top',
                }}
                placeholder="Tell us what's on your mind..."
                placeholderTextColor={colors.textSecondary}
                value={feedbackForm.description}
                onChangeText={onDescriptionChange}
                multiline
                numberOfLines={5}
                maxLength={400}
              />
              <Text
                style={{ color: colors.textSecondary }}
                className="text-sm mt-2 text-right"
              >
                {feedbackForm.description.length}/400
              </Text>
            </View>

            <View className="mb-8">
              <Text
                style={{ color: colors.text }}
                className="text-lg font-semibold mb-3"
              >
                Email (optional)
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 16,
                  color: colors.text,
                  fontSize: 16,
                }}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
                value={feedbackForm.email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: 16,
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-medium"
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSendFeedback}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 16,
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text className="text-white text-lg font-medium">Send</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export default FeedbackModal;
