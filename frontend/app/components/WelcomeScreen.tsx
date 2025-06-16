import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useWelcomeAnimations } from './WelcomeScreen/hooks/useWelcomeAnimations';
import { BackgroundStars } from './WelcomeScreen/BackgroundStars';
import { SimpleProgressDots } from './SimpleProgressDots';
import { WelcomeAnimation } from './WelcomeScreen/animations/WelcomeAnimation';
import { TapAnimation } from './WelcomeScreen/animations/TapAnimation';
import { ScrollAnimation } from './WelcomeScreen/animations/ScrollAnimation';
import { StartAnimation } from './WelcomeScreen/animations/StartAnimation';
import { WelcomeScreenProps, WelcomeStep } from './WelcomeScreen/types';

const { width, height } = Dimensions.get('window');

const WELCOME_STEPS: WelcomeStep[] = [
  {
    title: 'Welcome to Idioms!',
    subtitle: 'Discover idiomatic expressions from around the world',
    animation: 'welcome',
  },
  {
    title: 'TAP to Flip Cards',
    subtitle: 'Each card has a surprise on the other side',
    animation: 'tap',
  },
  {
    title: 'SCROLL to Explore',
    subtitle: 'Infinite scroll with thousands of expressions',
    animation: 'scroll',
  },
  {
    title: 'Start Your Journey!',
    subtitle: 'Learn while having fun',
    animation: 'start',
  },
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const { colors } = useTheme();

  const {
    progressAnim,
    starsOpacity,
    pulseStyle,
    cardFlipStyle,
    cardBackStyle,
    sparkleStyles,
    scrollStyles,
    emojiStyles,
    startPulseAnimation,
    flipCard,
    startScrollAnimation,
    startFinalAnimation,
    resetCardFlip,
  } = useWelcomeAnimations();

  const executeStepAnimation = useCallback(() => {
    switch (currentStep) {
      case 0:
        startPulseAnimation();
        break;
      case 1:
        setTimeout(() => {
          flipCard(setCardFlipped);
        }, 1500);
        break;
      case 2:
        startScrollAnimation();
        break;
      case 3:
        startFinalAnimation();
        break;
    }
  }, [
    currentStep,
    startPulseAnimation,
    flipCard,
    startScrollAnimation,
    startFinalAnimation,
  ]);

  useEffect(() => {
    progressAnim.value = withTiming(currentStep, { duration: 300 });
    executeStepAnimation();
  }, [currentStep, progressAnim, executeStepAnimation]);

  const handleNext = () => {
    if (currentStep < WELCOME_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setCardFlipped(false);
      resetCardFlip();
    }
  };

  const handleStart = () => {
    onComplete?.();
  };

  const handleSkip = () => {
    setCurrentStep(WELCOME_STEPS.length - 1);
  };

  const renderCurrentAnimation = () => {
    const step = WELCOME_STEPS[currentStep];

    switch (step.animation) {
      case 'welcome':
        return <WelcomeAnimation pulseStyle={pulseStyle} colors={colors} />;
      case 'tap':
        return (
          <TapAnimation
            cardFlipped={cardFlipped}
            flipCard={() => flipCard(setCardFlipped)}
            cardFlipStyle={cardFlipStyle}
            cardBackStyle={cardBackStyle}
            sparkleStyles={sparkleStyles}
          />
        );
      case 'scroll':
        return (
          <ScrollAnimation
            scrollStyles={scrollStyles}
            pulseStyle={pulseStyle}
            colors={colors}
          />
        );
      case 'start':
        return (
          <StartAnimation pulseStyle={pulseStyle} emojiStyles={emojiStyles} />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === WELCOME_STEPS.length - 1;
  const showSkipButton = currentStep > 0 && !isLastStep;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={
          colors.background === '#000000' ? 'light-content' : 'dark-content'
        }
      />

      <BackgroundStars
        colors={colors}
        width={width}
        height={height}
        starsOpacity={starsOpacity}
      />

      <View style={styles.content}>
        <SimpleProgressDots
          currentStep={currentStep}
          totalSteps={WELCOME_STEPS.length}
          colors={{
            active: colors.text,
            inactive: colors.textSecondary + '50',
            completed: '#10B981',
          }}
          size={12}
          spacing={4}
          containerStyle={{ marginBottom: 40 }}
        />

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {WELCOME_STEPS[currentStep].title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {WELCOME_STEPS[currentStep].subtitle}
          </Text>
        </View>

        {renderCurrentAnimation()}

        <View style={styles.buttonContainer}>
          {!isLastStep ? (
            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.nextButton,
                { backgroundColor: colors.cardBackground },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.nextButtonText, { color: colors.text }]}>
                Next
              </Text>
              <Ionicons name="chevron-forward" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleStart}
              style={styles.startButtonFinal}
              activeOpacity={0.8}
            >
              <View style={styles.startButtonFinalGradient}>
                <Text style={styles.startButtonText}>Start! 🚀</Text>
              </View>
            </TouchableOpacity>
          )}

          {showSkipButton && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text
                style={[styles.skipButtonText, { color: colors.textSecondary }]}
              >
                Skip intro
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  startButtonFinal: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonFinalGradient: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#F97316',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  skipButton: {
    marginTop: 16,
  },
  skipButtonText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
