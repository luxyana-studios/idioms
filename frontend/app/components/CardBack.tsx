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
import Collapsible from 'react-native-collapsible';

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
  const [showAllExamples, setShowAllExamples] = React.useState(false);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          width: CARD_WIDTH,
          minHeight: CARD_HEIGHT,
          backgroundColor: '#1c1a2d',
        },
        backAnimatedStyle,
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!showAllExamples && (
          <>
            <Animated.View style={styles.divider} />
            <MeaningSection meaning={item.meaning} />
            <ExplanationSection explanation={item.explanation} />
          </>
        )}
        <ExamplesSection
          examples={item.examples}
          showAll={showAllExamples}
          setShowAll={setShowAllExamples}
        />
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

interface ExamplesSectionProps {
  examples: string[];
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExamplesSection = ({
  examples,
  showAll,
  setShowAll,
}: ExamplesSectionProps) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Examples</Text>
      <Text style={styles.exampleItem}>• {examples[0]}</Text>
      <Collapsible collapsed={!showAll} duration={300}>
        {examples.slice(1).map((example, idx) => (
          <Text key={idx + 1} style={styles.exampleItem}>
            • {example}
          </Text>
        ))}
      </Collapsible>
      {examples.length > 1 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          style={styles.showMoreButton}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {showAll ? 'Show Less' : `Show All (${examples.length})`}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 14,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 36,
  },
  divider: {
    height: 2,
    width: '40%',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 8,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginTop: 8,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(220, 220, 220, 0.9)',
    marginBottom: 16,
    paddingLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 34,
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
    lineHeight: 22,
    color: 'rgba(220, 220, 220, 0.9)',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  showMoreButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  icon: {
    opacity: 0.8,
  },
});
