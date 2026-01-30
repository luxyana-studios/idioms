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

/**
 * Quick action button with Organic Flow styling.
 * Features: soft shadows, organic rounded corners, sage green accents.
 */
const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onPress,
  compact = false,
}) => {
  const { colors, theme } = useTheme();

  // Organic Flow color scheme
  const iconBgColor =
    theme === 'light'
      ? 'rgba(167, 196, 160, 0.18)' // Sage tint
      : 'rgba(184, 212, 176, 0.12)';
  const iconColor = theme === 'light' ? '#A7C4A0' : '#B8D4B0';
  const borderColor =
    theme === 'light'
      ? 'rgba(167, 196, 160, 0.25)'
      : 'rgba(184, 212, 176, 0.15)';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: compact ? 'column' : 'row',
        alignItems: 'center',
        padding: compact ? 14 : 18,
        marginBottom: compact ? 0 : 12,
        borderRadius: 24, // Organic larger radius
        backgroundColor:
          theme === 'light'
            ? 'rgba(253, 252, 250, 0.9)' // Warm white
            : 'rgba(45, 53, 48, 0.85)', // Dark forest
        borderWidth: 1,
        borderColor: borderColor,
        minHeight: compact ? 140 : undefined,
        // Soft organic shadow
        shadowColor: theme === 'light' ? '#8B9B7E' : '#0F1210',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* Organic blob-like icon container */}
      <View
        style={{
          width: compact ? 52 : 48,
          height: compact ? 52 : 48,
          // Organic blob shape
          borderTopLeftRadius: 22,
          borderTopRightRadius: 26,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: compact ? 10 : 0,
          marginRight: compact ? 0 : 16,
          backgroundColor: iconBgColor,
        }}
      >
        <Ionicons name={icon} size={compact ? 26 : 24} color={iconColor} />
      </View>
      <View style={{ flex: 1, alignItems: compact ? 'center' : 'flex-start' }}>
        <Text
          style={{
            color: colors.text,
            fontSize: compact ? 15 : 17,
            fontWeight: '600',
            marginBottom: 4,
            textAlign: compact ? 'center' : 'left',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: theme === 'light' ? '#7A8B6E' : '#C4D4BE', // Earth moss
            fontSize: compact ? 13 : 14,
            textAlign: compact ? 'center' : 'left',
          }}
          numberOfLines={compact ? 2 : undefined}
        >
          {description}
        </Text>
      </View>
      {!compact && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme === 'light' ? '#A7C4A0' : '#B8D4B0'}
        />
      )}
    </TouchableOpacity>
  );
};

QuickAction.displayName = 'QuickAction';

export default QuickAction;
