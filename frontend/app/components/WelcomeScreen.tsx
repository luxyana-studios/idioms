import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const { colors } = useTheme();

  const pulseAnim = useSharedValue(1);
  const cardFlipAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);
  const starsOpacity = useSharedValue(0.3);

  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);
  const sparkle4 = useSharedValue(0);
  const sparkle5 = useSharedValue(0);
  const sparkle6 = useSharedValue(0);

  const scroll1 = useSharedValue(0);
  const scroll2 = useSharedValue(0);
  const scroll3 = useSharedValue(0);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulseAnim.value },
      {
        rotate: `${interpolate(pulseAnim.value, [1, 1.1], [0, 2])}deg`,
      },
    ],
  }));

  const starsStyle = useAnimatedStyle(() => ({
    opacity: starsOpacity.value,
  }));

  const cardFlipStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(cardFlipAnim.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const cardBackStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(cardFlipAnim.value, [0, 1], [180, 360])}deg` },
    ],
  }));

  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1.value,
    transform: [{ scale: sparkle1.value }],
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2.value,
    transform: [{ scale: sparkle2.value }],
  }));

  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3.value,
    transform: [{ scale: sparkle3.value }],
  }));

  const sparkle4Style = useAnimatedStyle(() => ({
    opacity: sparkle4.value,
    transform: [{ scale: sparkle4.value }],
  }));

  const sparkle5Style = useAnimatedStyle(() => ({
    opacity: sparkle5.value,
    transform: [{ scale: sparkle5.value }],
  }));

  const sparkle6Style = useAnimatedStyle(() => ({
    opacity: sparkle6.value,
    transform: [{ scale: sparkle6.value }],
  }));

  const scroll1Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scroll1.value, [0, 1], [0, -10]),
      },
      { scale: 1.1 },
    ],
    opacity: interpolate(scroll1.value, [0, 0.5, 1], [0.7, 1, 0.7]),
  }));

  const scroll2Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scroll2.value, [0, 1], [0, -10]),
      },
      { scale: 0.95 },
    ],
    opacity: interpolate(scroll2.value, [0, 0.5, 1], [0.7, 1, 0.7]),
  }));

  const scroll3Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scroll3.value, [0, 1], [0, -10]),
      },
      { scale: 0.95 },
    ],
    opacity: interpolate(scroll3.value, [0, 0.5, 1], [0.7, 1, 0.7]),
  }));

  const emoji1Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  const emoji2Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  const emoji3Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  const emoji4Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  const progressDot0Style = useAnimatedStyle(() => ({
    backgroundColor:
      0 === currentStep
        ? colors.text
        : 0 < currentStep
          ? '#10B981'
          : colors.textSecondary + '50',
    transform: [
      {
        scale: 0 === currentStep ? 1.3 : 1,
      },
    ],
  }));

  const progressDot1Style = useAnimatedStyle(() => ({
    backgroundColor:
      1 === currentStep
        ? colors.text
        : 1 < currentStep
          ? '#10B981'
          : colors.textSecondary + '50',
    transform: [
      {
        scale: 1 === currentStep ? 1.3 : 1,
      },
    ],
  }));

  const progressDot2Style = useAnimatedStyle(() => ({
    backgroundColor:
      2 === currentStep
        ? colors.text
        : 2 < currentStep
          ? '#10B981'
          : colors.textSecondary + '50',
    transform: [
      {
        scale: 2 === currentStep ? 1.3 : 1,
      },
    ],
  }));

  const progressDot3Style = useAnimatedStyle(() => ({
    backgroundColor:
      3 === currentStep
        ? colors.text
        : 3 < currentStep
          ? '#10B981'
          : colors.textSecondary + '50',
    transform: [
      {
        scale: 3 === currentStep ? 1.3 : 1,
      },
    ],
  }));

  const steps = [
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

  useEffect(() => {
    progressAnim.value = withTiming(currentStep, { duration: 300 });

    switch (currentStep) {
      case 0:
        startPulseAnimation();
        break;
      case 1:
        setTimeout(() => {
          flipCard();
        }, 1500);
        break;
      case 2:
        startScrollAnimation();
        break;
      case 3:
        startFinalAnimation();
        break;
    }
  }, [currentStep]);

  const startPulseAnimation = () => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000 }),
        withTiming(1, { duration: 2000 }),
      ),
      -1,
    );
    starsOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 }),
      ),
      -1,
    );
  };

  const flipCard = () => {
    runOnJS(setCardFlipped)(true);
    cardFlipAnim.value = withTiming(1, { duration: 700 });

    sparkle1.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 }),
    );
    sparkle2.value = withSequence(
      withTiming(0, { duration: 100 }),
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 }),
    );
    sparkle3.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 }),
    );
    sparkle4.value = withSequence(
      withTiming(0, { duration: 300 }),
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 }),
    );
    sparkle5.value = withSequence(
      withTiming(0, { duration: 400 }),
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 }),
    );
    sparkle6.value = withSequence(
      withTiming(0, { duration: 500 }),
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 }),
    );
  };

  const startScrollAnimation = () => {
    scroll1.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
    );
    scroll2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
    );
    scroll3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
    );
  };

  const startFinalAnimation = () => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500 }),
        withTiming(1, { duration: 1500 }),
      ),
      -1,
      false,
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCardFlipped(false);
      cardFlipAnim.value = 0;
    }
  };

  const handleStart = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const renderWelcomeAnimation = () => (
    <View style={styles.animationContainer}>
      <Animated.View style={[styles.welcomeCard, pulseStyle]}>
        <LinearGradient
          colors={['#8B5CF6', '#EC4899', '#F97316']}
          style={styles.cardGradient}
        >
          <Ionicons name="language" size={64} color="white" />
          <Text style={styles.cardTitle}>Idioms</Text>
          <Text style={styles.cardSubtitle}>World Expressions</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.sparkleContainer}>
        <Animated.View style={[styles.sparkle, pulseStyle]}>
          <Ionicons name="star" size={20} color="#FFD700" />
        </Animated.View>
      </View>
    </View>
  );

  const renderTapAnimation = () => (
    <View style={styles.animationContainer}>
      <TouchableOpacity
        onPress={() => !cardFlipped && flipCard()}
        style={styles.cardContainer}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.flipCard, cardFlipStyle]}>
          <View style={[styles.cardGradient, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.cardEmoji}>🌟</Text>
            <Text style={styles.cardTitle}>Expression</Text>
            <Text style={styles.cardContent}>"Break a leg"</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.flipCard, styles.flipCardBack, cardBackStyle]}
        >
          <View style={[styles.cardGradient, { backgroundColor: '#10B981' }]}>
            <Text style={styles.cardEmoji}>🎭</Text>
            <Text style={styles.cardTitle}>Meaning</Text>
            <Text style={styles.cardContent}>"Good luck!"</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.sparkleEffect,
          sparkle1Style,
          {
            left: width * 0.2,
            top: 120,
          },
        ]}
      >
        <Ionicons name="star" size={12} color="#FFD700" />
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleEffect,
          sparkle2Style,
          {
            left: width * 0.8,
            top: 150,
          },
        ]}
      >
        <Ionicons name="star" size={12} color="#FFD700" />
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleEffect,
          sparkle3Style,
          {
            left: width * 0.1,
            top: 200,
          },
        ]}
      >
        <Ionicons name="star" size={12} color="#FFD700" />
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleEffect,
          sparkle4Style,
          {
            left: width * 0.9,
            top: 250,
          },
        ]}
      >
        <Ionicons name="star" size={12} color="#FFD700" />
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleEffect,
          sparkle5Style,
          {
            left: width * 0.3,
            top: 280,
          },
        ]}
      >
        <Ionicons name="star" size={12} color="#FFD700" />
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleEffect,
          sparkle6Style,
          {
            left: width * 0.7,
            top: 300,
          },
        ]}
      >
        <Ionicons name="star" size={12} color="#FFD700" />
      </Animated.View>
    </View>
  );

  const renderScrollAnimation = () => {
    const expressions = [
      { emoji: '🌍', text: 'Around the world', meaning: 'En todo el mundo' },
      { emoji: '🎨', text: 'Piece of cake', meaning: 'Pan comido' },
      { emoji: '🚀', text: 'Shoot for stars', meaning: 'Apuntar alto' },
    ];

    return (
      <View style={styles.animationContainer}>
        <View style={styles.scrollContainer}>
          <Animated.View style={[styles.scrollCard, scroll1Style]}>
            <View
              style={[
                styles.scrollCardGradient,
                { backgroundColor: '#6366F1' },
              ]}
            >
              <Text style={styles.scrollEmoji}>{expressions[0].emoji}</Text>
              <View style={styles.scrollTextContainer}>
                <Text style={styles.scrollTitle}>{expressions[0].text}</Text>
                <Text style={styles.scrollSubtitle}>
                  {expressions[0].meaning}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.scrollCard, scroll2Style]}>
            <View
              style={[
                styles.scrollCardGradient,
                { backgroundColor: '#6366F1' },
              ]}
            >
              <Text style={styles.scrollEmoji}>{expressions[1].emoji}</Text>
              <View style={styles.scrollTextContainer}>
                <Text style={styles.scrollTitle}>{expressions[1].text}</Text>
                <Text style={styles.scrollSubtitle}>
                  {expressions[1].meaning}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.scrollCard, scroll3Style]}>
            <View
              style={[
                styles.scrollCardGradient,
                { backgroundColor: '#6366F1' },
              ]}
            >
              <Text style={styles.scrollEmoji}>{expressions[2].emoji}</Text>
              <View style={styles.scrollTextContainer}>
                <Text style={styles.scrollTitle}>{expressions[2].text}</Text>
                <Text style={styles.scrollSubtitle}>
                  {expressions[2].meaning}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.scrollIndicator}>
          <Animated.View style={pulseStyle}>
            <Ionicons
              name="chevron-down"
              size={32}
              color={colors.textSecondary}
            />
          </Animated.View>
        </View>
      </View>
    );
  };

  const renderStartAnimation = () => (
    <View style={styles.animationContainer}>
      <Animated.View style={[styles.startButton, pulseStyle]}>
        <View
          style={[styles.startButtonGradient, { backgroundColor: '#F97316' }]}
        >
          <Ionicons name="flash" size={64} color="white" />
        </View>
      </Animated.View>

      <View style={styles.emojiContainer}>
        <Animated.Text style={[styles.floatingEmoji, emoji1Style]}>
          🌟
        </Animated.Text>
        <Animated.Text style={[styles.floatingEmoji, emoji2Style]}>
          🎯
        </Animated.Text>
        <Animated.Text style={[styles.floatingEmoji, emoji3Style]}>
          🚀
        </Animated.Text>
        <Animated.Text style={[styles.floatingEmoji, emoji4Style]}>
          💫
        </Animated.Text>
      </View>
    </View>
  );

  const renderAnimation = () => {
    switch (steps[currentStep].animation) {
      case 'welcome':
        return renderWelcomeAnimation();
      case 'tap':
        return renderTapAnimation();
      case 'scroll':
        return renderScrollAnimation();
      case 'start':
        return renderStartAnimation();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={
          colors.background === '#000000' ? 'light-content' : 'dark-content'
        }
      />

      <View style={styles.starsContainer}>
        {[...Array(20)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.star,
              starsStyle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                backgroundColor: colors.text,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressDot, progressDot0Style]} />
          <Animated.View style={[styles.progressDot, progressDot1Style]} />
          <Animated.View style={[styles.progressDot, progressDot2Style]} />
          <Animated.View style={[styles.progressDot, progressDot3Style]} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {steps[currentStep].title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {steps[currentStep].subtitle}
          </Text>
        </View>

        {renderAnimation()}

        <View style={styles.buttonContainer}>
          {currentStep < steps.length - 1 ? (
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
              <View
                style={[
                  styles.startButtonFinalGradient,
                  { backgroundColor: '#F97316' },
                ]}
              >
                <Text style={styles.startButtonText}>Start! 🚀</Text>
              </View>
            </TouchableOpacity>
          )}

          {currentStep > 0 && currentStep < steps.length - 1 && (
            <TouchableOpacity
              onPress={() => setCurrentStep(steps.length - 1)}
              style={styles.skipButton}
            >
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
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
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
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
  },
  welcomeCard: {
    width: 260,
    height: 320,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  cardContent: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    top: -16,
    right: -16,
  },
  sparkle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(252,211,77,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: 260,
    height: 320,
  },
  flipCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  tapIndicator: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
  },
  tapButton: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sparkleEffect: {
    position: 'absolute',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    width: 260,
  },
  scrollCard: {
    height: 96,
    marginVertical: 8,
    borderRadius: 16,
  },
  scrollCardGradient: {
    flex: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  scrollEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  scrollTextContainer: {
    flex: 1,
  },
  scrollTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  scrollIndicator: {
    marginTop: 2,
    alignItems: 'center',
  },
  startButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 24,
  },
  startButtonGradient: {
    flex: 1,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
  },
  floatingEmoji: {
    fontSize: 32,
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
