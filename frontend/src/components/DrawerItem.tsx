import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

export const DrawerItem: React.FC<DrawerItemProps> = ({
  item,
  isActive,
  onPress,
  colors,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center px-6 py-4 mx-2 rounded-lg mb-2"
    style={{
      backgroundColor: isActive ? colors.primary + '20' : 'transparent',
    }}
  >
    <Ionicons
      name={item.icon}
      size={24}
      color={isActive ? colors.primary : colors.textSecondary}
    />
    <Text
      style={{ color: isActive ? colors.primary : colors.text }}
      className="ml-4 text-lg font-medium"
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);
