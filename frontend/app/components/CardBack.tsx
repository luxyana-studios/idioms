import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ScrollView,
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

export const CardBack = ({
  item,
  handleFavoritePress,
  backAnimatedStyle,
  CARD_WIDTH,
  CARD_HEIGHT,
}: CardBackProps) => {
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={styles.divider} />
        <MeaningSection meaning={item.meaning} />
        <ExplanationSection explanation={item.explanation} />

        <Text style={styles.sectionTitle}>Examples</Text>
        {item.examples.map((example, index) => (
          <Text key={index} style={styles.exampleItem}>
            • {example}
          </Text>
        ))}
      </ScrollView>

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
    </Animated.View>
  );
};

const MeaningSection = ({ meaning }: { meaning: string }) => (
  <>
    <Text style={styles.sectionTitle}>Meaning</Text>
    <Text style={styles.sectionContent}>{meaning}</Text>
  </>
);

const ExplanationSection = ({ explanation }: { explanation: string }) => (
  <>
    <Text style={styles.sectionTitle}>Explanation</Text>
    <Text style={styles.sectionContent}>{explanation}</Text>
  </>
);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 24,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  divider: {
    height: 2,
    width: '40%',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(220, 220, 220, 0.9)',
    marginBottom: 20,
    paddingLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 24,
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
  exampleItem: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(220, 220, 220, 0.9)',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletPoint: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
