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

  const handleNextPress = () => {
    if (currentStep === 'meaning') {
      setCurrentStep('explanation');
    } else if (currentStep === 'explanation') {
      setCurrentStep('examples');
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'meaning':
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.mainText}>{item.meaning}</Text>
          </View>
        );
      case 'explanation':
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.mainText}>{item.explanation}</Text>
          </View>
        );
      case 'examples':
        return (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Examples</Text>
            {item.examples.map((example, index) => (
              <Text key={index} style={styles.exampleItem}>
                • {example}
              </Text>
            ))}
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
          backgroundColor: '#1c1a2d',
        },
        backAnimatedStyle,
      ]}
    >
      {renderContent()}

      <TouchableOpacity
        onPress={handleFavoritePress}
        style={styles.favoriteButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.isFavorite ? 'star' : 'star-outline'}
          size={26}
          color={item.isFavorite ? '#FFD700' : 'rgba(255, 255, 255, 0.8)'}
        />
      </TouchableOpacity>

      {currentStep !== 'examples' && (
        <TouchableOpacity
          onPress={handleNextPress}
          style={styles.nextButton}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 24,
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  examplesContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  examplesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  exampleItem: {
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(220, 220, 220, 0.95)',
    marginBottom: 16,
    paddingLeft: 8,
    textAlign: 'left',
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
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
});
