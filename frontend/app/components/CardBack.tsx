import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardBackProps {
  item: CardData;
  backAnimatedStyle: AnimatedStyle<ViewStyle>;
  handleFavoritePress: (e: GestureResponderEvent) => void;
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
}

type ContentStep = 'meaning' | 'explanation' | 'examples';

export const CardBack = ({
  item,
  handleFavoritePress,
  backAnimatedStyle,
  CARD_WIDTH,
  CARD_HEIGHT,
}: CardBackProps) => {
  const [currentStep, setCurrentStep] = useState<ContentStep>('meaning');
  const { colors } = useTheme();

  const handleNextPress = () => {
    if (currentStep === 'meaning') {
      setCurrentStep('explanation');
    } else if (currentStep === 'explanation') {
      setCurrentStep('examples');
    }
  };

  const handleBackPress = () => {
    if (currentStep === 'examples') {
      setCurrentStep('explanation');
    } else if (currentStep === 'explanation') {
      setCurrentStep('meaning');
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'meaning':
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.stepTitle, { color: '#FFD700' }]}>
              Meaning
            </Text>
            <Text style={[styles.mainText, { color: colors.text }]}>
              {item.meaning}
            </Text>
          </View>
        );
      case 'explanation':
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.stepTitle, { color: '#FFD700' }]}>
              Explanation
            </Text>
            <Text style={[styles.mainText, { color: colors.text }]}>
              {item.explanation}
            </Text>
          </View>
        );
      case 'examples':
        return (
          <View style={styles.examplesContainer}>
            <Text style={[styles.stepTitle, { color: '#FFD700' }]}>
              Examples
            </Text>
            <View style={styles.examplesContent}>
              {item.examples.map((example, index) => (
                <Text
                  key={index}
                  style={[styles.exampleItem, { color: colors.textSecondary }]}
                >
                  • {example}
                </Text>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          backgroundColor: colors.cardBackBackground,
          shadowColor: colors.shadowColor,
        },
        backAnimatedStyle,
      ]}
    >
      {renderContent()}

      <TouchableOpacity
        onPress={handleFavoritePress}
        style={[
          styles.favoriteButton,
          { backgroundColor: `${colors.cardBackBackground}CC` },
        ]}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.isFavorite ? 'star' : 'star-outline'}
          size={26}
          color={item.isFavorite ? '#FFD700' : colors.text}
        />
      </TouchableOpacity>

      {/* Indicadores de pasos */}
      <View style={styles.stepIndicators}>
        <View
          style={[styles.dot, currentStep === 'meaning' && styles.activeDot]}
        />
        <View
          style={[
            styles.dot,
            currentStep === 'explanation' && styles.activeDot,
          ]}
        />
        <View
          style={[styles.dot, currentStep === 'examples' && styles.activeDot]}
        />
      </View>

      {currentStep !== 'examples' && (
        <TouchableOpacity
          onPress={handleNextPress}
          style={styles.nextButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      {currentStep !== 'meaning' && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60, // Espacio para el botón de favorito
    paddingBottom: 90, // Más espacio para los botones de navegación
    maxHeight: '100%',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    maxWidth: '100%',
    flexShrink: 1,
    flex: 1,
  },
  examplesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60, // Espacio para el botón de favorito
    paddingBottom: 90, // Más espacio para los botones de navegación
    maxHeight: '100%',
  },
  examplesContent: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxHeight: '100%',
  },
  exampleItem: {
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(220, 220, 220, 0.95)',
    marginBottom: 8,
    paddingLeft: 8,
    textAlign: 'left',
    flexShrink: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(28, 26, 45, 0.7)',
    borderRadius: 30,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stepIndicators: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    transform: [{ translateX: -10 }], // Más a la derecha y centrado solo para los puntos
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFD700',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
