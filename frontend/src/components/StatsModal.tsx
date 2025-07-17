import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import IdiomStats from './IndicatorsDisplay';

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

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      exit={{ opacity: 0, translateY: -20, scale: 0.9 }}
      transition={{ type: 'timing', duration: 300 }}
      style={{
        position: 'absolute',
        top: CARD_HEIGHT * 0.1,
        left: CARD_WIDTH * 0.05,
        right: CARD_WIDTH * 0.05,
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
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
          borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            color: '#FFD700',
            fontSize: 16,
            fontWeight: '600',
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
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <IdiomStats item={item} />
    </MotiView>
  );
};

export default StatsModal;
