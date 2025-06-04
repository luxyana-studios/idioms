import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CardData } from '../types/card';

interface IndicatorsDisplayProps {
  item: CardData;
}

const getFrequencyIndicator = (frequency: number) => {
  const percentage = Math.max(10, frequency * 10);

  let color = '#8B5CF6';
  let bgColor = 'rgba(139, 92, 246, 0.2)';

  if (frequency >= 7) {
    color = '#10B981';
    bgColor = 'rgba(16, 185, 129, 0.2)';
  } else if (frequency >= 5) {
    color = '#F59E0B';
    bgColor = 'rgba(245, 158, 11, 0.2)';
  }

  return {
    percentage,
    color,
    bgColor,
    frequency,
  };
};

const getSentimentIndicator = (sentiment: string[]) => {
  const primarySentiment = sentiment[0] || 'neutral';

  switch (primarySentiment) {
    case 'positive':
      return {
        color: '#10B981',
        label: '😊',
      };
    case 'negative':
      return {
        color: '#8B5CF6',
        label: '😔',
      };
    default:
      return {
        color: '#F59E0B',
        label: '😐',
      };
  }
};

const getDifficultyIndicators = (literal: number, translation: number) => {
  const getLiteralIndicator = (transparency: number) => {
    const percentage = Math.max(10, transparency * 10);

    let color = '#8B5CF6';
    let bgColor = 'rgba(139, 92, 246, 0.2)';

    if (transparency >= 7) {
      color = '#10B981';
      bgColor = 'rgba(16, 185, 129, 0.2)';
    } else if (transparency >= 5) {
      color = '#F59E0B';
      bgColor = 'rgba(245, 158, 11, 0.2)';
    }

    return {
      percentage,
      color,
      bgColor,
      value: transparency,
    };
  };

  const getTranslationIndicator = (difficulty: number) => {
    const percentage = Math.max(10, difficulty * 10);

    let color = '#10B981';
    let bgColor = 'rgba(16, 185, 129, 0.2)';

    if (difficulty >= 7) {
      color = '#8B5CF6';
      bgColor = 'rgba(139, 92, 246, 0.2)';
    } else if (difficulty >= 5) {
      color = '#F59E0B';
      bgColor = 'rgba(245, 158, 11, 0.2)';
    }

    return {
      percentage,
      color,
      bgColor,
      value: difficulty,
    };
  };

  return {
    literal: getLiteralIndicator(literal),
    translation: getTranslationIndicator(translation),
  };
};

const IndicatorsDisplay: React.FC<IndicatorsDisplayProps> = ({ item }) => {
  const frequencyIndicator = getFrequencyIndicator(item.frequency_of_use);
  const sentimentIndicator = getSentimentIndicator(item.sentiment);
  const difficultyIndicators = getDifficultyIndicators(
    item.literal_transparency,
    item.translation_difficulty,
  );

  return (
    <View style={styles.indicatorsContainer}>
      <View
        style={[
          styles.indicatorRow,
          { backgroundColor: frequencyIndicator.bgColor },
        ]}
      >
        <Text
          style={[styles.indicatorLabel, { color: frequencyIndicator.color }]}
        >
          Frequency
        </Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                {
                  width: `${frequencyIndicator.percentage}%`,
                  backgroundColor: frequencyIndicator.color,
                },
              ]}
            />
          </View>
          <Text
            style={[styles.indicatorValue, { color: frequencyIndicator.color }]}
          >
            {frequencyIndicator.frequency}/10
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.indicatorRow,
          { backgroundColor: `${sentimentIndicator.color}33` },
        ]}
      >
        <Text
          style={[styles.indicatorLabel, { color: sentimentIndicator.color }]}
        >
          Sentiment
        </Text>
        <Text
          style={[styles.sentimentEmoji, { color: sentimentIndicator.color }]}
        >
          {sentimentIndicator.label}
        </Text>
      </View>

      <View
        style={[
          styles.indicatorRow,
          { backgroundColor: difficultyIndicators.literal.bgColor },
        ]}
      >
        <Text
          style={[
            styles.indicatorLabel,
            { color: difficultyIndicators.literal.color },
          ]}
        >
          Transparency
        </Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                {
                  width: `${difficultyIndicators.literal.percentage}%`,
                  backgroundColor: difficultyIndicators.literal.color,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.indicatorValue,
              { color: difficultyIndicators.literal.color },
            ]}
          >
            {difficultyIndicators.literal.value}/10
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.indicatorRow,
          { backgroundColor: difficultyIndicators.translation.bgColor },
        ]}
      >
        <Text
          style={[
            styles.indicatorLabel,
            { color: difficultyIndicators.translation.color },
          ]}
        >
          Translation
        </Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                {
                  width: `${difficultyIndicators.translation.percentage}%`,
                  backgroundColor: difficultyIndicators.translation.color,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.indicatorValue,
              { color: difficultyIndicators.translation.color },
            ]}
          >
            {difficultyIndicators.translation.value}/10
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorsContainer: {
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 4,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    minHeight: 40,
    width: '100%',
  },
  indicatorLabel: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 70,
    textAlign: 'left',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    marginRight: 8,
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  indicatorValue: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  sentimentEmoji: {
    fontSize: 18,
    lineHeight: 18,
    marginLeft: 'auto',
    textAlign: 'center',
    minWidth: 35,
    paddingVertical: 2,
  },
});

export default IndicatorsDisplay;
