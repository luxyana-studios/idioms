import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface QuickActionProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-4 mb-3 rounded-xl"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: colors.primary + '20' }}
      >
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text
          style={{ color: colors.text }}
          className="text-lg font-semibold mb-1"
        >
          {title}
        </Text>
        <Text style={{ color: colors.textSecondary }} className="text-sm">
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

QuickAction.displayName = 'QuickAction';

export default QuickAction;
