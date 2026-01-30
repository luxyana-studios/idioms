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
import AnimatedView from './AnimatedView';
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

const MeaningContent = ({
  meaning,
  textColor,
  alternativeDepiction,
  item,
}: MeaningContentProps) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);

  const { computed } = useTheme();

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
        <AnimatedView
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
        </AnimatedView>

        <View style={styles.emojiContainer}>
          {showEmojis ? (
            <AnimatedView
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
            </AnimatedView>
          ) : null}
        </View>
      </View>

      {showIndicators && (
        <AnimatedView
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
        </AnimatedView>
      )}
    </View>
  );
};

const ExplanationContent = ({
  explanation,
  textColor,
}: ExplanationContentProps) => {
  const { computed } = useTheme();

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

      <AnimatedView
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
      </AnimatedView>
    </View>
  );
};

const ExamplesContent = ({
  examples,
  textSecondaryColor,
}: ExamplesContentProps) => {
  const [showAllExamples, setShowAllExamples] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const { computed } = useTheme();

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
          <AnimatedView
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
          </AnimatedView>
        ))}

        {showButton && examples.length > 1 && !showAllExamples && (
          <AnimatedView
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
          </AnimatedView>
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
          shadowColor: theme === 'light' ? '#8B9B7E' : '#0F1210',
          borderWidth: 1,
          borderColor:
            theme === 'light'
              ? 'rgba(167, 196, 160, 0.25)'
              : 'rgba(184, 212, 176, 0.15)',
        },
        backAnimatedStyle,
      ]}
    >
      {/* Organic Flow gradient for card back */}
      <LinearGradient
        colors={
          theme === 'light'
            ? [
                'rgba(212, 165, 116, 0.06)', // Subtle terracotta tint
                colors.cardBackBackground ?? '#F5F1EB',
                'rgba(167, 196, 160, 0.08)', // Soft sage
              ]
            : [
                'rgba(229, 184, 148, 0.08)', // Dark terracotta
                colors.cardBackBackground ?? '#252B27',
                'rgba(184, 212, 176, 0.1)', // Dark sage
              ]
        }
        locations={[0, 0.5, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 36,
        }}
      />
      {/* Subtle organic overlay */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 36,
          backgroundColor:
            theme === 'light'
              ? 'rgba(167, 196, 160, 0.04)'
              : 'rgba(184, 212, 176, 0.03)',
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
    borderRadius: 36, // Organic larger curves
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B9B7E', // Sage-tinted shadow
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2, // Softer shadow
    shadowRadius: 24, // Larger blur for organic feel
    elevation: 10,
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
    bottom: 22,
    right: 26,
    zIndex: 3,
    backgroundColor: 'rgba(167, 196, 160, 0.15)', // Sage tint
    borderRadius: 22, // Organic pill
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 196, 160, 0.3)',
    shadowColor: '#8B9B7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    bottom: 22,
    left: 26,
    zIndex: 3,
    backgroundColor: 'rgba(167, 196, 160, 0.15)', // Sage tint
    borderRadius: 22, // Organic pill
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 196, 160, 0.3)',
    shadowColor: '#8B9B7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    width: 10,
    height: 10,
    borderRadius: 10, // Organic blob-like
    backgroundColor: 'rgba(167, 196, 160, 0.3)', // Sage tint
    marginHorizontal: 5,
  },
  activeDot: {
    width: 14,
    height: 14,
    borderRadius: 14, // Organic blob
    shadowColor: '#8B9B7E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 196, 160, 0.4)',
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
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 22, // Organic pill shape
    borderWidth: 1,
    borderColor: 'rgba(167, 196, 160, 0.3)',
    backgroundColor: 'rgba(167, 196, 160, 0.1)',
    shadowColor: '#8B9B7E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
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
