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
import { LinearGradient } from 'expo-linear-gradient';

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

const MeaningContent = ({
  meaning,
  textColor,
  alternativeDepiction,
  item,
}: MeaningContentProps) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);

  const { theme, colors, computed } = useTheme();

  const resolvedHeaderColor = computed.headerColor;

  return (
    <View style={styles.meaningContentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="bulb-outline" size={22} color={resolvedHeaderColor} />
        <Text
          style={[
            styles.stepTitle,
            {
              color: resolvedHeaderColor,
              textShadowColor: computed.textShadowColor,
              textShadowOffset: computed.textShadowOffset,
              textShadowRadius: computed.textShadowRadius,
            },
          ]}
        >
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
                          backgroundColor: resolvedHeaderColor + '18',
                          borderRadius: 12,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          margin: 2,
                          borderWidth: 1,
                          borderColor: resolvedHeaderColor,
                        }}
                      >
                        <Text
                          style={{
                            color: resolvedHeaderColor,
                            fontWeight: '700',
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
  const { theme, colors, computed } = useTheme();

  const resolvedHeaderColor = computed.headerColor;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="book-outline" size={22} color={resolvedHeaderColor} />
        <Text
          style={[
            styles.stepTitle,
            {
              color: resolvedHeaderColor,
              textShadowColor: computed.textShadowColor,
              textShadowOffset: computed.textShadowOffset,
              textShadowRadius: computed.textShadowRadius,
            },
          ]}
        >
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

  const { theme, colors, computed } = useTheme();

  const resolvedHeaderColor = computed.headerColor;
  const resolvedAccent = computed.accent;

  const handleShowMoreExamples = () => {
    setShowAllExamples(true);
  };

  const examplesToShow = showAllExamples ? examples : [examples[0]];

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleSection}>
        <Ionicons name="list-outline" size={22} color={resolvedHeaderColor} />
        <Text
          style={[
            styles.stepTitle,
            {
              color: resolvedHeaderColor,
              textShadowColor: computed.textShadowColor,
              textShadowOffset: computed.textShadowOffset,
              textShadowRadius: computed.textShadowRadius,
            },
          ]}
        >
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
                  backgroundColor: computed.softBackground,
                  borderColor: computed.subtleBorder,
                },
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.showMoreContent}>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={resolvedAccent}
                />
                <Text
                  style={[
                    styles.showMoreText,
                    {
                      color: resolvedAccent,
                      textShadowColor: computed.textShadowColor,
                    },
                  ]}
                >
                  Show more examples
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={resolvedAccent}
                />
              </View>
            </TouchableOpacity>
          </MotiView>
        )}
      </View>
    </View>
  );
};

export const CardBack = ({
  item,
  backAnimatedStyle,
  CARD_WIDTH,
  CARD_HEIGHT,
  currentStep,
  onStepChange,
}: CardBackProps) => {
  const { theme, colors, computed } = useTheme();

  const steps: ContentStep[] = ['meaning', 'explanation', 'examples'];

  const headingColor = computed.headerColor;
  const accentColor = computed.accent;
  const navIconColor = computed.headerColor;

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
            textColor={computed.cardTextColor}
            alternativeDepiction={item.alternative_depiction}
            item={item}
          />
        );
      case 'explanation':
        return (
          <ExplanationContent
            explanation={item.explanation}
            textColor={computed.cardTextColor}
          />
        );
      case 'examples':
        return (
          <ExamplesContent
            examples={item.examples}
            textSecondaryColor={computed.cardTextSecondaryColor}
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
      <LinearGradient
        colors={[
          colors.cardBackBackground ??
            colors.cardBackground ??
            (theme === 'light' ? '#eef5ea' : '#1f2a1f'),
          colors.surface ?? (theme === 'light' ? '#e3ece0' : '#111611'),
          colors.secondary ??
            colors.surface ??
            (theme === 'light' ? '#d6e3d2' : '#172017'),
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.12, y: 0.05 }}
        end={{ x: 0.88, y: 0.95 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 20,
        }}
      />
      <View
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          backgroundColor: computed.softBackground,
        }}
      />

      {renderContent()}

      <View style={styles.stepIndicators}>
        {steps.map((step) => {
          const isActive = currentStep === step;
          const baseDotBg = computed.stepDotBackground;
          const activeBg = computed.accent;
          return (
            <View
              key={step}
              style={[
                styles.dot,
                { backgroundColor: baseDotBg },
                isActive && [
                  styles.activeDot,
                  {
                    backgroundColor: activeBg,
                    borderColor: computed.subtleBorder,
                  },
                ],
              ]}
            />
          );
        })}
      </View>

      {currentStep !== 'examples' && (
        <TouchableOpacity
          onPress={handleNextPress}
          style={[
            styles.nextButton,
            {
              backgroundColor: computed.softBackground,
              borderColor: computed.subtleBorder,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={navIconColor} />
        </TouchableOpacity>
      )}

      {currentStep !== 'meaning' && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={[
            styles.backButton,
            {
              backgroundColor: computed.softBackground,
              borderColor: computed.subtleBorder,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={navIconColor} />
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
    fontWeight: '800',
    letterSpacing: 0.5,
    flexShrink: 0,
    marginLeft: 8,
  },
  showMoreText: {
    fontWeight: '800',
    fontSize: 15,
    marginLeft: 8,
    marginRight: 6,
    letterSpacing: 0.3,
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    right: 24,
    zIndex: 3,
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
    zIndex: 3,
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
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#00000014',
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
