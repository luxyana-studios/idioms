import { useState, memo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import Animated, { AnimatedStyle, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';
import { MotiView } from 'moti';
import { ContentStep } from '../hooks/useCardFlip';
import GradientBackground from './GradientBackground';

interface CardBackProps {
  item: CardData;
  backAnimatedStyle: AnimatedStyle<ViewStyle>;
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
  currentStep: ContentStep;
  onStepChange: (step: ContentStep) => void;
}

interface MeaningContentProps {
  meaning: string;
  textColor: string;
  alternativeDepiction: string[];
  item: CardData;
}

interface ExplanationContentProps {
  explanation: string;
  textColor: string;
}

interface ExamplesContentProps {
  examples: string[];
  textSecondaryColor: string;
}

interface StepIndicatorsProps {
  currentStep: ContentStep;
  steps: ContentStep[];
}

const PRIMARY_ACCENT_COLOR = '#AEEA00';

const MeaningContent = ({
  meaning,
  textColor,
  alternativeDepiction,
  item,
}: MeaningContentProps) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);

  return (
    <View style={styles.meaningContentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="bulb-outline" size={22} color={PRIMARY_ACCENT_COLOR} />
        <Text style={[styles.stepTitle, { color: PRIMARY_ACCENT_COLOR }]}>
          Meaning
        </Text>
      </View>

      <View style={styles.meaningContent}>
        <MotiView
          from={{ opacity: 0, scale: 0.85, translateY: 24 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 1200,
            easing: Easing.out(Easing.exp),
          }}
          onDidAnimate={(key, finished) => {
            if (key === 'opacity' && finished) {
              setTimeout(() => setShowEmojis(true), 100);
            }
          }}
        >
          <Text style={[styles.cleanText, { color: textColor }]}>
            {meaning}
          </Text>
        </MotiView>

        <View style={styles.emojiContainer}>
          {showEmojis ? (
            <MotiView
              from={{ opacity: 0, scale: 0.85, translateY: 16 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{
                type: 'spring',
                damping: 18,
                stiffness: 120,
                mass: 0.8,
                delay: 100,
              }}
              onDidAnimate={(key, finished) => {
                if (key === 'scale' && finished) {
                  setTimeout(() => setShowIndicators(true), 150);
                }
              }}
            >
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
                          backgroundColor: PRIMARY_ACCENT_COLOR + '22',
                          borderRadius: 12,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          margin: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: PRIMARY_ACCENT_COLOR,
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
            </MotiView>
          ) : null}
        </View>
      </View>

      {showIndicators && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 400,
            easing: Easing.out(Easing.exp),
            delay: 50,
          }}
        >
          <View
            style={{
              marginTop: 4,
              width: '100%',
              marginBottom: 35,
              paddingHorizontal: 8,
              alignItems: 'flex-start',
            }}
          ></View>
        </MotiView>
      )}
    </View>
  );
};

const ExplanationContent = ({
  explanation,
  textColor,
}: ExplanationContentProps) => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="book-outline" size={22} color={PRIMARY_ACCENT_COLOR} />
        <Text style={[styles.stepTitle, { color: PRIMARY_ACCENT_COLOR }]}>
          Explanation
        </Text>
      </View>

      <MotiView
        from={{ opacity: 0, scale: 0.95, translateY: 30 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 1200,
          easing: Easing.out(Easing.exp),
        }}
      >
        <Text style={[styles.cleanText, { color: textColor }]}>
          {explanation}
        </Text>
      </MotiView>
    </View>
  );
};

const ExamplesContent = ({
  examples,
  textSecondaryColor,
}: ExamplesContentProps) => {
  const [showAllExamples, setShowAllExamples] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleShowMoreExamples = () => {
    setShowAllExamples(true);
  };

  const examplesToShow = showAllExamples ? examples : [examples[0]];

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="list-outline" size={22} color={PRIMARY_ACCENT_COLOR} />
        <Text style={[styles.stepTitle, { color: PRIMARY_ACCENT_COLOR }]}>
          Examples
        </Text>
      </View>

      <View style={{ width: '100%' }}>
        {examplesToShow.map((example, idx) => (
          <MotiView
            key={idx}
            from={{ opacity: 0, scale: 0.95, translateY: 24 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: 800,
              easing: Easing.out(Easing.exp),
              delay: idx * 220,
            }}
            onDidAnimate={(key, finished) => {
              if (
                key === 'opacity' &&
                finished &&
                idx === 0 &&
                examples.length > 1 &&
                !showAllExamples
              ) {
                setTimeout(() => setShowButton(true), 100);
              }
            }}
          >
            <Text
              style={[
                styles.cleanText,
                {
                  color: textSecondaryColor,
                  textAlign: 'left',
                  fontSize: 16,
                  lineHeight: 22,
                  marginBottom: 16,
                },
              ]}
            >
              {idx + 1}. {example}
            </Text>
          </MotiView>
        ))}

        {showButton && examples.length > 1 && !showAllExamples && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              damping: 16,
              stiffness: 100,
              mass: 0.15,
              delay: 100,
            }}
          >
            <TouchableOpacity
              onPress={handleShowMoreExamples}
              style={[
                styles.showMoreButton,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.showMoreContent}>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={PRIMARY_ACCENT_COLOR}
                />
                <Text style={styles.showMoreText}>Show more examples</Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={PRIMARY_ACCENT_COLOR}
                />
              </View>
            </TouchableOpacity>
          </MotiView>
        )}
      </View>
    </View>
  );
};

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
  backAnimatedStyle,
  CARD_WIDTH,
  CARD_HEIGHT,
  currentStep,
  onStepChange,
}: CardBackProps) => {
  const { colors } = useTheme();

  const steps: ContentStep[] = ['meaning', 'explanation', 'examples'];

  const handleNextPress = () => {
    if (currentStep === 'meaning') {
      onStepChange('explanation');
    } else if (currentStep === 'explanation') {
      onStepChange('examples');
    }
  };

  const handleBackPress = () => {
    if (currentStep === 'examples') {
      onStepChange('explanation');
    } else if (currentStep === 'explanation') {
      onStepChange('meaning');
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'meaning':
        return (
          <MeaningContent
            meaning={item.meaning}
            textColor="#FFFFFF"
            alternativeDepiction={item.alternative_depiction}
            item={item}
          />
        );
      case 'explanation':
        return (
          <ExplanationContent
            explanation={item.explanation}
            textColor="#FFFFFF"
          />
        );
      case 'examples':
        return (
          <ExamplesContent
            examples={item.examples}
            textSecondaryColor="#F3F4F6"
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
          shadowColor: colors.shadowColor,
        },
        backAnimatedStyle,
      ]}
    >
      <GradientBackground hasMatte={true} />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(128, 128, 128, 0.7)',
          borderRadius: 20,
        }}
      />

      {renderContent()}

      <StepIndicators currentStep={currentStep} steps={steps} />

      {currentStep !== 'examples' && (
        <TouchableOpacity
          onPress={handleNextPress}
          style={[
            styles.nextButton,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {currentStep !== 'meaning' && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={[
            styles.backButton,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// memoized to prevent rerenders when props unchanged
const MemoizedCardBack = memo(CardBack);
MemoizedCardBack.displayName = 'CardBack';

export default MemoizedCardBack;

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
  meaningContentContainer: {
    flex: 1,
    justifyContent: 'center',
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
    color: PRIMARY_ACCENT_COLOR,
    letterSpacing: 0.5,
    flexShrink: 0,
    marginLeft: 8,
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
    left: '50%',
    transform: [{ translateX: -5 }],
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
    backgroundColor: PRIMARY_ACCENT_COLOR,
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
    borderRadius: 25,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  showMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showMoreText: {
    color: PRIMARY_ACCENT_COLOR,
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
    marginRight: 6,
    letterSpacing: 0.3,
  },
  meaningContent: {
    width: '100%',
    alignItems: 'center',
  },
  emojiContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
});
