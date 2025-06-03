import { useState } from 'react';
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
  alternativeDepiction?: string[];
}

const MeaningContent = ({
  meaning,
  textColor,
  alternativeDepiction,
}: MeaningContentProps) => {
  const [showCursor, setShowCursor] = useState(true);
  const [showAlternativeEmojis, setShowAlternativeEmojis] = useState(false);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="bulb-outline" size={22} color="#FFD700" />
        <Text style={[styles.stepTitle, { color: '#FFD700' }]}>Meaning</Text>
      </View>
      <View style={styles.meaningCard}>
        <TypeAnimation
          sequence={[
            {
              text: '',
              typeSpeed: 60,
              delayBetweenSequence: 500,
            },
            {
              action: () => setShowCursor(true),
            },
            {
              text: meaning,
              typeSpeed: 70,
              delayBetweenSequence: 100,
            },
            {
              action: () => {
                setTimeout(() => {
                  setShowCursor(false);
                  // Show alternative emojis after text animation completes
                  setTimeout(() => setShowAlternativeEmojis(true), 300);
                }, 800);
              },
            },
          ]}
          style={{
            ...styles.mainText,
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
      {showAlternativeEmojis &&
        alternativeDepiction &&
        alternativeDepiction.length > 0 && (
          <View style={styles.alternativeDepictionContainer}>
            <View style={styles.alternativeDepictionRow}>
              {alternativeDepiction.map((emoji, index) => (
                <Text key={index} style={styles.alternativeEmoji}>
                  {emoji}
                </Text>
              ))}
            </View>
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
      <View style={styles.explanationCard}>
        <TypeAnimation
          sequence={[
            {
              text: '',
              typeSpeed: 50,
              delayBetweenSequence: 300,
            },
            {
              action: () => setShowCursor(true),
            },
            {
              text: explanation,
              typeSpeed: 60,
              delayBetweenSequence: 100,
            },
            {
              action: () => {
                setTimeout(() => setShowCursor(false), 800);
              },
            },
          ]}
          style={{
            ...styles.explanationText,
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
  const [showCursor, setShowCursor] = useState(true);

  const examplesText = examples
    .slice(0, 3)
    .map((example, index) => `${index + 1}. ${example}`)
    .join('\n\n');

  return (
    <View style={styles.examplesContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="list-outline" size={22} color="#FFD700" />
        <Text style={[styles.stepTitle, { color: '#FFD700' }]}>Examples</Text>
      </View>
      <View style={styles.examplesCard}>
        <TypeAnimation
          sequence={[
            {
              text: '',
              typeSpeed: 40,
              delayBetweenSequence: 300,
            },
            {
              action: () => setShowCursor(true),
            },
            {
              text: examplesText,
              typeSpeed: 50,
              delayBetweenSequence: 100,
            },
            {
              action: () => {
                setTimeout(() => setShowCursor(false), 800);
              },
            },
          ]}
          style={{
            ...styles.examplesText,
            color: textSecondaryColor,
            flexWrap: 'wrap',
            textAlign: 'left',
          }}
          cursor={showCursor}
          cursorStyle={{
            color: textSecondaryColor,
            fontSize: 18,
            fontWeight: 'bold',
          }}
          blinkSpeed={400}
          repeat={1}
        />
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
          name={item.isFavorite ? 'star' : 'star-outline'}
          size={26}
          color={item.isFavorite ? '#FFD700' : colors.text}
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
  meaningCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  explanationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    width: '105%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: -8,
  },
  explanationText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    flexWrap: 'wrap',
  },
  examplesContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 60,
    maxHeight: '100%',
  },
  examplesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-start',
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
    transform: [{ translateX: -10 }],
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
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    maxWidth: '100%',
  },
  examplesText: {
    fontSize: 15.5,
    lineHeight: 19,
    textAlign: 'left',
    fontWeight: '400',
    flexWrap: 'wrap',
  },
  alternativeDepictionContainer: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alternativeDepictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  alternativeEmoji: {
    fontSize: 24,
    marginHorizontal: 4,
  },
});
