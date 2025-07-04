import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
      className="p-3 rounded-2xl border shadow-lg"
      activeOpacity={0.7}
    >
      <Ionicons
        name={theme === 'light' ? 'moon' : 'sunny'}
        size={24}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

export default ThemeToggle;
