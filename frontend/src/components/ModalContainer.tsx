import React from 'react';
import { View, TouchableOpacity, DimensionValue } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../contexts/ThemeContext';
import { useKeyboardDetection } from '../hooks/useKeyboardDetection';
import { createModalStyles } from '../styles/modalStyles';

interface ModalContainerProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
  keyboardAdjustment?: {
    translateY: number;
    maxHeight: DimensionValue;
  };
}

export const ModalContainer = ({
  isVisible,
  onClose,
  children,
  zIndex = 10000,
  keyboardAdjustment,
}: ModalContainerProps) => {
  const { colors } = useTheme();
  const keyboardVisible = useKeyboardDetection();
  const styles = createModalStyles(colors);

  if (!isVisible) return null;

  const shouldAdjustForKeyboard = keyboardVisible && keyboardAdjustment;

  return (
    <View style={[styles.overlay, { zIndex }]}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <MotiView
        from={{ opacity: 0, scale: 0.9, translateY: 50 }}
        animate={{
          opacity: 1,
          scale: 1,
          translateY: shouldAdjustForKeyboard
            ? keyboardAdjustment.translateY
            : 0,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={[
          styles.container,
          shouldAdjustForKeyboard && {
            maxHeight: keyboardAdjustment.maxHeight,
          },
        ]}
      >
        {children}
      </MotiView>
    </View>
  );
};
