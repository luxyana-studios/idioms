import { useState, memo } from 'react';
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
import { TypeAnimation } from 'react-native-type-animation';
import IdiomStats from './IndicatorsDisplay';
import SmileyDisplay from './SmileyDisplay';

interface CardBackProps {
  item: CardData;
  backAnimatedStyle: AnimatedStyle<ViewStyle>;
  handleFavoritePress: (e: GestureResponderEvent) => void;
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
}

type ContentStep = 'meaning' | 'explanation' | 'examples';

interface MeaningContentProps {
  meaning: string;
  textColor: string;
  alternativeDepiction: string[];
  item: CardData;
}

const MeaningContent = ({
  meaning,
  textColor,
  alternativeDepiction,
  item,
}: MeaningContentProps) => {
  const [showCursor, setShowCursor] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="bulb-outline" size={22} color="#FFD700" />
        <Text style={[styles.stepTitle, { color: '#FFD700' }]}>Meaning</Text>
      </View>

      <TypeAnimation
        sequence={[
          {
            text: '',
            typeSpeed: 30,
            delayBetweenSequence: 200,
          },
          {
            action: () => setShowCursor(true),
          },
          {
            text: meaning,
            typeSpeed: 30,
            delayBetweenSequence: 300,
          },
          {
            action: () => {
              setTimeout(() => {
                setShowCursor(false);
                setShowEmojis(true);
                setTimeout(() => setShowIndicators(true), 600);
              }, 800);
            },
          },
        ]}
        style={{
          ...styles.cleanText,
          color: textColor,
        }}
        cursor={showCursor}
        cursorStyle={{
          color: textColor,
          fontSize: 20,
          fontWeight: 'bold',
        }}
        blinkSpeed={400}
        repeat={1}
      />

      {showEmojis && (
        <>
          <View style={{ marginTop: 16, marginBottom: 12 }}>
            <SmileyDisplay smileys={alternativeDepiction} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {item.category_theme &&
              item.category_theme.map((category, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#FFD70022',
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    margin: 2,
                  }}
                >
                  <Text
                    style={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      fontSize: 13,
                    }}
                  >
                    {category}
                  </Text>
                </View>
              ))}
          </View>
        </>
      )}
      {showIndicators && (
        <View
          style={{
            marginTop: 4,
            width: '100%',
            marginBottom: 35,
            paddingHorizontal: 8,
            alignItems: 'flex-start',
          }}
        >
          <IdiomStats item={item} />
        </View>
      )}
    </View>
  );
};

interface ExplanationContentProps {
  explanation: string;
  textColor: string;
}

const ExplanationContent = ({
  explanation,
  textColor,
}: ExplanationContentProps) => {
  const [showCursor, setShowCursor] = useState(true);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="book-outline" size={22} color="#FFD700" />
        <Text style={[styles.stepTitle, { color: '#FFD700' }]}>
          Explanation
        </Text>
      </View>

      <TypeAnimation
        sequence={[
          {
            text: '',
            typeSpeed: 20,
            delayBetweenSequence: 100,
          },
          {
            action: () => setShowCursor(true),
          },
          {
            text: explanation,
            typeSpeed: 20,
            delayBetweenSequence: 300,
          },
          {
            action: () => {
              setTimeout(() => setShowCursor(false), 800);
            },
          },
        ]}
        style={{
          ...styles.cleanText,
          color: textColor,
        }}
        cursor={showCursor}
        cursorStyle={{
          color: textColor,
          fontSize: 20,
          fontWeight: 'bold',
        }}
        blinkSpeed={400}
        repeat={1}
      />
    </View>
  );
};

interface ExamplesContentProps {
  examples: string[];
  textSecondaryColor: string;
}

const ExamplesContent = ({
  examples,
  textSecondaryColor,
}: ExamplesContentProps) => {
  const [showAllExamples, setShowAllExamples] = useState(false);
  const [firstExampleComplete, setFirstExampleComplete] = useState(false);
  const [visibleIndexes, setVisibleIndexes] = useState([0]);
  const { colors } = useTheme();

  const handleAnimationEnd = (idx: number) => {
    if (idx === 0) {
      setFirstExampleComplete(true);
    }

    if (showAllExamples && idx < examples.length - 1) {
      setTimeout(() => {
        setVisibleIndexes((prev) => [...prev, idx + 1]);
      }, 300);
    }
  };

  const handleShowMoreExamples = () => {
    setShowAllExamples(true);
    if (examples.length > 1) {
      setTimeout(() => {
        setVisibleIndexes((prev) => [...prev, 1]);
      }, 100);
    }
  };

  const examplesToShow = showAllExamples ? examples : [examples[0]];

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="list-outline" size={22} color="#FFD700" />
        <Text style={[styles.stepTitle, { color: '#FFD700' }]}>Examples</Text>
      </View>
      <View style={{ width: '100%' }}>
        {examplesToShow.map((example, idx) =>
          visibleIndexes.includes(idx) ? (
            <TypeAnimation
              key={idx}
              sequence={[
                {
                  text: `${idx + 1}. ${example}`,
                  typeSpeed: 20,
                  delayBetweenSequence: 100,
                },
                {
                  action: () => handleAnimationEnd(idx),
                },
              ]}
              style={{
                ...styles.cleanText,
                color: textSecondaryColor,
                textAlign: 'left',
                fontSize: 16,
                lineHeight: 22,
                marginBottom: 16,
              }}
              cursor={false}
              repeat={1}
            />
          ) : null,
        )}

        {examples.length > 1 && !showAllExamples && firstExampleComplete && (
          <TouchableOpacity
            onPress={handleShowMoreExamples}
            style={[
              styles.showMoreButton,
              { backgroundColor: colors.cardBackBackground },
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.showMoreContent}>
              <Ionicons name="add-circle-outline" size={20} color="#FFD700" />
              <Text style={styles.showMoreText}>Show more examples</Text>
              <Ionicons name="chevron-down" size={16} color="#FFD700" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface StepIndicatorsProps {
  currentStep: ContentStep;
  steps: ContentStep[];
}

const StepIndicators = ({ currentStep, steps }: StepIndicatorsProps) => (
  <View style={styles.stepIndicators}>
    {steps.map((step) => (
      <View
        key={step}
        style={[styles.dot, currentStep === step && styles.activeDot]}
      />
    ))}
  </View>
);

export const CardBack = ({
  item,
  handleFavoritePress,
  backAnimatedStyle,
  CARD_WIDTH,
  CARD_HEIGHT,
}: CardBackProps) => {
  const [currentStep, setCurrentStep] = useState<ContentStep>('meaning');
  const { colors } = useTheme();

  const steps: ContentStep[] = ['meaning', 'explanation', 'examples'];

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
          <MeaningContent
            meaning={item.meaning}
            textColor={colors.text}
            alternativeDepiction={item.alternative_depiction}
            item={item}
          />
        );
      case 'explanation':
        return (
          <ExplanationContent
            explanation={item.explanation}
            textColor={colors.text}
          />
        );
      case 'examples':
        return (
          <ExamplesContent
            examples={item.examples}
            textSecondaryColor={colors.textSecondary}
          />
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
          name={item.favorite ? 'star' : 'star-outline'}
          size={26}
          color={item.favorite ? '#FFD700' : colors.text}
        />
      </TouchableOpacity>

      <StepIndicators currentStep={currentStep} steps={steps} />

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

// memoized to prevent rerenders when props unchanged
export default memo(CardBack);

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
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 60,
    maxHeight: '100%',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.5,
    flexShrink: 0,
    marginLeft: 8,
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
    bottom: 20,
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
    bottom: 20,
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
    left: '52%',
    transform: [{ translateX: -10 }],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
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
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    maxWidth: '100%',
  },
  cleanText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    maxWidth: '100%',
  },
  showMoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFD70040',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  showMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showMoreText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
    marginRight: 6,
    letterSpacing: 0.3,
  },
});
