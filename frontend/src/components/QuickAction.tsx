import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface QuickActionProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  compact?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onPress,
  compact = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={
        compact
          ? 'flex-col items-center p-3 rounded-xl'
          : 'flex-row items-center p-4 mb-3 rounded-xl'
      }
      style={{
        backgroundColor: compact ? colors.surface + '90' : colors.surface,
        borderWidth: 1,
        borderColor: colors.border + '70',
        minHeight: compact ? 135 : undefined,
      }}
    >
      <View
        className={
          compact
            ? 'w-12 h-12 rounded-full items-center justify-center mb-2'
            : 'w-12 h-12 rounded-full items-center justify-center mr-4'
        }
        style={{
          backgroundColor: compact
            ? colors.primary + '15'
            : colors.primary + '20',
        }}
      >
        <Ionicons name={icon} size={compact ? 24 : 24} color={colors.primary} />
      </View>
      <View className={compact ? 'flex-1 items-center' : 'flex-1'}>
        <Text
          style={{ color: colors.text }}
          className={
            compact
              ? 'text-base font-semibold mb-1 text-center'
              : 'text-lg font-semibold mb-1'
          }
        >
          {title}
        </Text>
        <Text
          style={{
            color: (colors.text ?? '#1f2937') + 'BF',
          }}
          className={compact ? 'text-sm text-center' : 'text-sm'}
          numberOfLines={compact ? 2 : undefined}
        >
          {description}
        </Text>
      </View>
      {!compact && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
};

QuickAction.displayName = 'QuickAction';

export default QuickAction;
