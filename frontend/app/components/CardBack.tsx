import { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import Animated, {
  AnimatedStyle,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
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
  isFlipped: boolean;
}

type ContentStep = 'meaning' | 'explanation' | 'examples';

interface MeaningContentProps {
  meaning: string;
  textColor: string;
  isFlipped: boolean;
}

const MeaningContent = ({
  meaning,
  textColor,
  isFlipped,
}: MeaningContentProps) => {
  const [showCursor, setShowCursor] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!isFlipped) {
      setShowCursor(false);
      return;
    }

    setKey((prev) => prev + 1);
    setShowCursor(true);

    const typingTime = meaning.length * 70 + 500;
    const blinkTime = 800;
    const timer = setTimeout(() => {
      setShowCursor(false);
    }, typingTime + blinkTime);

    return () => clearTimeout(timer);
  }, [meaning, isFlipped]);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="bulb-outline" size={22} color="#FFD700" />
        <Text style={[styles.stepTitle, { color: '#FFD700' }]}>Meaning</Text>
      </View>
      <View style={styles.meaningCard}>
        <TypeAnimation
          key={key}
          sequence={[
            {
              text: meaning,
              typeSpeed: 70,
              delayBetweenSequence: 100,
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
    </View>
  );
};

interface ExplanationContentProps {
  explanation: string;
  textColor: string;
  isFlipped: boolean;
}

const ExplanationContent = ({
  explanation,
  textColor,
  isFlipped,
}: ExplanationContentProps) => {
  const [showCursor, setShowCursor] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!isFlipped) {
      setShowCursor(false);
      return;
    }

    setKey((prev) => prev + 1);
    setShowCursor(true);

    const typingTime = explanation.length * 60 + 500;
    const blinkTime = 800;
    const timer = setTimeout(() => {
      setShowCursor(false);
    }, typingTime + blinkTime);

    return () => clearTimeout(timer);
  }, [explanation, isFlipped]);

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
          key={key}
          sequence={[
            {
              text: explanation,
              typeSpeed: 60,
              delayBetweenSequence: 100,
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
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: (1 - opacity1.value) * 20 }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: (1 - opacity2.value) * 20 }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
    transform: [{ translateY: (1 - opacity3.value) * 20 }],
  }));

  const animatedStyles = [animatedStyle1, animatedStyle2, animatedStyle3];

  useEffect(() => {
    [opacity1, opacity2, opacity3].forEach((value, index) => {
      value.value = 0;
      value.value = withDelay(index * 400, withTiming(1, { duration: 800 }));
    });
  }, [examples, opacity1, opacity2, opacity3]);

  return (
    <View style={styles.examplesContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="list-outline" size={22} color="#FFD700" />
        <Text style={[styles.stepTitle, { color: '#FFD700' }]}>Examples</Text>
      </View>
      <View style={styles.examplesContent}>
        {examples.slice(0, 3).map((example, index) => (
          <Animated.View
            key={index}
            style={[styles.exampleRow, animatedStyles[index]]}
          >
            <View style={styles.exampleBullet}>
              <Text style={styles.bulletText}>{index + 1}</Text>
            </View>
            <Text style={[styles.exampleItem, { color: textSecondaryColor }]}>
              {example}
            </Text>
          </Animated.View>
        ))}
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
  isFlipped,
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
            isFlipped={isFlipped}
          />
        );
      case 'explanation':
        return (
          <ExplanationContent
            explanation={item.explanation}
            textColor={colors.text}
            isFlipped={isFlipped}
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
    paddingTop: 60,
    paddingBottom: 90,
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
  explanationText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
    fontStyle: 'italic',
  },
  examplesContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 90,
    maxHeight: '100%',
  },
  examplesContent: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    maxHeight: '100%',
    paddingTop: 8,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
  exampleBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  bulletText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  exampleItem: {
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(220, 220, 220, 0.95)',
    marginBottom: 8,
    paddingLeft: 4,
    textAlign: 'left',
    flex: 1,
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
});
