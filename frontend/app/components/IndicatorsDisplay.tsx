import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import Slider from '@react-native-community/slider';
import Tooltip from 'react-native-walkthrough-tooltip';

interface IndicatorsDisplayProps {
  item: CardData;
}

const getFrequencyIndicator = (frequency: number) => {
  const percentage = frequency * 10;

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
  const primarySentiment = sentiment[0];

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

const getLiteralTransparencyIndicator = (transparency: number) => {
  const percentage = transparency * 10;

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

const getTranslationDifficultyIndicator = (difficulty: number) => {
  const percentage = difficulty * 10;

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

const StatTooltip = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Tooltip
      isVisible={visible}
      content={
        <Text
          style={{
            color: '#fff',
            fontSize: 15,
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      }
      placement="left"
      onClose={() => setVisible(false)}
      backgroundColor="rgba(30,30,30,0.7)"
      contentStyle={{
        backgroundColor: 'rgba(30,30,30,0.97)',
        borderRadius: 12,
        padding: 12,
        maxWidth: 250,
      }}
    >
      <Pressable onPress={() => setVisible(true)} style={styles.tooltipButton}>
        <Ionicons name="information-circle-outline" size={16} color="#888" />
      </Pressable>
    </Tooltip>
  );
};

const IdiomsStats: React.FC<IndicatorsDisplayProps> = ({ item }) => {
  const frequencyIndicator = getFrequencyIndicator(item.frequency_of_use);
  const sentimentIndicator = getSentimentIndicator(item.sentiment);
  const literalTransparencyIndicator = getLiteralTransparencyIndicator(
    item.literal_transparency,
  );
  const translationDifficultyIndicator = getTranslationDifficultyIndicator(
    item.translation_difficulty,
  );

  return (
    <View style={styles.indicatorsContainer}>
      <View style={styles.indicatorRowWrapper}>
        <View style={[styles.indicatorRow, { backgroundColor: '#E9ECEF' }]}>
          <Text style={styles.indicatorLabel}>Sentiment</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sentimentEmoji}>
              {sentimentIndicator.label}
            </Text>
          </View>
        </View>
        <StatTooltip text="General sentiment associated with the idiom." />
      </View>

      <View style={styles.indicatorRowWrapper}>
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
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              value={frequencyIndicator.frequency}
              minimumTrackTintColor={frequencyIndicator.color}
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor={frequencyIndicator.color}
              disabled
            />
            <Text
              style={[
                styles.indicatorValue,
                { color: frequencyIndicator.color },
              ]}
            >
              {frequencyIndicator.percentage}%
            </Text>
          </View>
        </View>
        <StatTooltip text="How frequently the idiom is used in the language." />
      </View>

      <View style={styles.indicatorRowWrapper}>
        <View
          style={[
            styles.indicatorRow,
            { backgroundColor: literalTransparencyIndicator.bgColor },
          ]}
        >
          <Text
            style={[
              styles.indicatorLabel,
              { color: literalTransparencyIndicator.color },
            ]}
          >
            Literal Transparency
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              value={literalTransparencyIndicator.value}
              minimumTrackTintColor={literalTransparencyIndicator.color}
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor={literalTransparencyIndicator.color}
              disabled
            />
            <Text
              style={[
                styles.indicatorValue,
                { color: literalTransparencyIndicator.color },
              ]}
            >
              {literalTransparencyIndicator.percentage}%
            </Text>
          </View>
        </View>
        <StatTooltip text="How transparent the literal meaning of the idiom is." />
      </View>

      <View style={styles.indicatorRowWrapper}>
        <View
          style={[
            styles.indicatorRow,
            { backgroundColor: translationDifficultyIndicator.bgColor },
          ]}
        >
          <Text
            style={[
              styles.indicatorLabel,
              { color: translationDifficultyIndicator.color },
            ]}
          >
            Translation Difficulty
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              value={translationDifficultyIndicator.value}
              minimumTrackTintColor={translationDifficultyIndicator.color}
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor={translationDifficultyIndicator.color}
              disabled
            />
            <Text
              style={[
                styles.indicatorValue,
                { color: translationDifficultyIndicator.color },
              ]}
            >
              {translationDifficultyIndicator.percentage}%
            </Text>
          </View>
        </View>
        <StatTooltip text="Estimated difficulty of translating the idiom to other languages." />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorsContainer: {
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 4,
    paddingBottom: 4,
    maxWidth: '95%',
    alignSelf: 'flex-start',
  },
  indicatorRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    width: '100%',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    borderRadius: 4,
    minHeight: 24,
    flex: 1,
  },
  indicatorLabel: {
    fontSize: 9,
    fontWeight: '600',
    minWidth: 70,
    maxWidth: 70,
    textAlign: 'left',
    flexShrink: 0,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 4,
    height: 24,
    minWidth: 0,
  },
  slider: {
    flex: 1,
    height: 24,
    marginHorizontal: 2,
    minWidth: 80,
  },
  sentimentEmoji: {
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 'auto',
    textAlign: 'center',
    minWidth: 30,
    paddingVertical: 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  indicatorValue: {
    fontSize: 9,
    fontWeight: '600',
    minWidth: 28,
    textAlign: 'right',
    marginLeft: 4,
  },
  tooltipButton: {
    marginLeft: 4,
    padding: 1,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IdiomsStats;
