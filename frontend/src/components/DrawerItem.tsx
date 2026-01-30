import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

type DrawerItemProps = {
  item: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    screen: string;
  };
  isActive: boolean;
  onPress: () => void;
  colors: {
    primary: string;
    text: string;
    textSecondary: string;
  };
};

/**
 * Drawer menu item with Organic Flow styling.
 * Active state shows as soft blob indicator.
 */
export const DrawerItem: React.FC<DrawerItemProps> = ({
  item,
  isActive,
  onPress,
  colors,
}) => {
  const { theme } = useTheme();

  // Organic Flow colors
  const activeColor = theme === 'light' ? '#A7C4A0' : '#B8D4B0';
  const activeBg =
    theme === 'light'
      ? 'rgba(167, 196, 160, 0.15)'
      : 'rgba(184, 212, 176, 0.12)';
  const activeBorder =
    theme === 'light' ? 'rgba(167, 196, 160, 0.3)' : 'rgba(184, 212, 176, 0.2)';
  const inactiveText = theme === 'light' ? '#5A6B55' : '#C4D4BE';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginHorizontal: 10,
        marginBottom: 6,
        borderRadius: 20, // Organic rounded
        backgroundColor: isActive ? activeBg : 'transparent',
        borderWidth: isActive ? 1 : 0,
        borderColor: isActive ? activeBorder : 'transparent',
      }}
    >
      {/* Organic blob-like active indicator */}
      {isActive && (
        <View
          style={{
            position: 'absolute',
            left: 4,
            width: 4,
            height: 24,
            backgroundColor: activeColor,
            borderRadius: 4, // Organic pill
          }}
        />
      )}
      <Ionicons
        name={item.icon}
        size={22}
        color={isActive ? activeColor : inactiveText}
        style={{ marginLeft: isActive ? 4 : 0 }}
      />
      <Text
        style={{
          color: isActive ? activeColor : colors.text,
          fontSize: 16,
          fontWeight: isActive ? '600' : '500',
          marginLeft: 14,
        }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};
