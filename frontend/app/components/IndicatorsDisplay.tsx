import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import Slider from '@react-native-community/slider';

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
    <>
      <Pressable onPress={() => setVisible(true)} style={{ marginLeft: 4 }}>
        <Ionicons name="information-circle-outline" size={16} color="#888" />
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
          <View
            style={{
              position: 'absolute',
              top: '40%',
              left: '10%',
              right: '10%',
              backgroundColor: 'rgba(30,30,30,0.97)',
              borderRadius: 12,
              padding: 18,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>
              {text}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
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
            style={{ flex: 1, marginRight: 8 }}
            minimumValue={0}
            maximumValue={10}
            value={frequencyIndicator.frequency}
            minimumTrackTintColor={frequencyIndicator.color}
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor={frequencyIndicator.color}
            disabled
          />
          <Text
            style={[styles.indicatorValue, { color: frequencyIndicator.color }]}
          >
            {frequencyIndicator.percentage}%
          </Text>
          <StatTooltip text="How frequently the idiom is used in the language." />
        </View>
      </View>

      <View style={[styles.indicatorRow, { backgroundColor: '#F5F5F5' }]}>
        <Text style={styles.indicatorLabel}>Sentiment</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sentimentEmoji}>{sentimentIndicator.label}</Text>
          <StatTooltip text="General sentiment associated with the idiom." />
        </View>
      </View>

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
            style={{ flex: 1, marginRight: 8 }}
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
          <StatTooltip text="How transparent the literal meaning of the idiom is." />
        </View>
      </View>

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
            style={{ flex: 1, marginRight: 8 }}
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
          <StatTooltip text="Estimated difficulty of translating the idiom to other languages." />
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
  sentimentEmoji: {
    fontSize: 18,
    lineHeight: 18,
    marginLeft: 'auto',
    textAlign: 'center',
    minWidth: 35,
    paddingVertical: 2,
  },
  indicatorValue: {
    fontSize: 13,
    fontWeight: '500',
    minWidth: 32,
    textAlign: 'right',
    marginLeft: 4,
  },
});

export default IdiomsStats;
