import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import IdiomStats from './IndicatorsDisplay';
import { useTheme } from '../contexts/ThemeContext';

interface StatsModalProps {
  item: CardData;
  isVisible: boolean;
  onClose: () => void;
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
}

const StatsModal: React.FC<StatsModalProps> = ({
  item,
  isVisible,
  onClose,
  CARD_WIDTH,
  CARD_HEIGHT,
}) => {
  if (!isVisible) return null;

  const { theme, colors } = useTheme();
  const primary = colors.primary || '#AEEA00';
  const labelColor =
    theme === 'light'
      ? (colors.text ?? '#111111')
      : (colors.textSecondary ?? '#d1d5db');

  const modalBg =
    theme === 'light'
      ? (colors.surface ?? '#ffffff') + 'F2'
      : 'rgba(31, 41, 55, 0.95)';
  const border =
    theme === 'light'
      ? (colors.border ?? '#cbd5e1') + '99'
      : 'rgba(255,255,255,0.2)';
  const divider =
    theme === 'light'
      ? (colors.border ?? '#cbd5e1') + '99'
      : 'rgba(255,255,255,0.1)';

  return (
    <MotiView
      from={{ opacity: 0, translateY: -12, scale: 0.96 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      exit={{ opacity: 0, translateY: -12, scale: 0.96 }}
      transition={{ type: 'timing', duration: 250 }}
      style={{
        position: 'absolute',
        top: CARD_HEIGHT * 0.18,
        left: CARD_WIDTH * 0.08,
        right: CARD_WIDTH * 0.08,
        backgroundColor: modalBg,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: border,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: theme === 'light' ? 0.2 : 0.35,
        shadowRadius: theme === 'light' ? 12 : 16,
        elevation: 20,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: divider,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            color: primary,
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          Idiom Statistics
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 4,
          }}
        >
          <Ionicons name="close" size={20} color={primary} />
        </TouchableOpacity>
      </View>

      <IdiomStats item={item} />
    </MotiView>
  );
};

export default StatsModal;
