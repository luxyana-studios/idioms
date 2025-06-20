import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface DropdownMenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  items: DropdownMenuItem[];
  position?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  items,
  position = { top: 60, right: 20 },
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
        onPress={onClose}
        activeOpacity={1}
      />

      <View
        style={{
          position: 'absolute',
          ...position,
          backgroundColor: colors.cardBackground,
          borderRadius: 12,
          paddingVertical: 8,
          minWidth: 160,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 15,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              item.onPress();
              onClose();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={colors.text}
              style={{ marginRight: 12 }}
            />
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default DropdownMenu;
