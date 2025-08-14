import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import pandaBackground from '../assets/background/fondo-panda.webp';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WelcomeStep {
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
}

const welcomeSteps: WelcomeStep[] = [
  {
    title: 'Welcome to IdiomApp!',
    subtitle: 'Your companion to master idiomatic expressions',
    description:
      'Discover the fascinating world of idioms and cultural expressions from around the globe',
    emoji: '🌟',
  },
  {
    title: 'Learn by Playing',
    subtitle: 'Interactive and dynamic cards',
    description:
      'Tap cards to reveal meanings, examples, and cultural contexts of each expression',
    emoji: '🎯',
  },
  {
    title: 'Explore Cultures',
    subtitle: 'Expressions from around the world',
    description:
      'Discover unique phrases from different countries and understand the cultural background behind each one',
    emoji: '🌍',
  },
  {
    title: 'Easy Navigation',
    subtitle: 'Swipe or tap to navigate',
    description:
      'Use intuitive gestures - swipe between cards or tap buttons to explore the app seamlessly',
    emoji: '👆',
  },
  {
    title: 'Start your Adventure!',
    subtitle: 'Everything ready to begin',
    description:
      'Embark on this exciting journey of cultural learning and language discovery',
    emoji: '🚀',
  },
];

const WelcomeScreen = () => {
  const router = useRouter();
  const { colors, computed } = useTheme();
  const subtitleColor = computed.cardTextSecondaryColorLight;
  const nextButtonBg = subtitleColor;
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const flatListRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const itemWidth = screenWidth - 40;
      if (flatListRef.current?.scrollToOffset) {
        flatListRef.current.scrollToOffset({
          offset: nextStep * itemWidth,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex?.({
          index: nextStep,
          animated: true,
        });
      }
    } else {
      handleNavigate();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const itemWidth = screenWidth - 40;
      if (flatListRef.current?.scrollToOffset) {
        flatListRef.current.scrollToOffset({
          offset: prevStep * itemWidth,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex?.({
          index: prevStep,
          animated: true,
        });
      }
    }
  };

  const handleNavigate = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/(drawer)/home');
    });
  };

  const handleSkip = () => {
    handleNavigate();
  };

  const rightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      handleNext();
    });

  const leftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      handlePrev();
    });

  const gesture = Gesture.Exclusive(rightGesture, leftGesture);

  const renderStep = ({
    item,
    index,
  }: {
    item: WelcomeStep;
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.emojiContainer,
          {
            backgroundColor: computed.accent + '22',
          },
        ]}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>

      <Text style={[styles.title, { color: computed.cardTextColorLight }]}>
        {item.title}
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: computed.cardTextSecondaryColorLight },
        ]}
      >
        {item.subtitle}
      </Text>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
    </Animated.View>
  );

  const renderIndicator = (index: number) => (
    <Animated.View
      key={index}
      style={[
        styles.indicator,
        {
          backgroundColor:
            index === currentStep
              ? computed.iconColor
              : computed.stepDotBackground,
          width: index === currentStep ? 32 : 12,
          transform: [
            {
              scale: index === currentStep ? 1.2 : 1,
            },
          ],
        },
      ]}
    />
  );

  const content = (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={pandaBackground}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: colors.textSecondary }]}>
          Skip
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={welcomeSteps}
          renderItem={renderStep}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ alignItems: 'center' }}
          style={{ width: '100%' }}
          getItemLayout={(_, index) => ({
            length: screenWidth - 40,
            offset: (screenWidth - 40) * index,
            index,
          })}
        />

        <View style={styles.indicatorsContainer}>
          {welcomeSteps.map((_, index) => renderIndicator(index))}
        </View>

        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${((currentStep + 1) / welcomeSteps.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {currentStep + 1} of {welcomeSteps.length}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.prevButton,
                {
                  borderColor: colors.border,
                  backgroundColor: 'transparent',
                },
              ]}
              onPress={handlePrev}
            >
              <Text style={[styles.prevButtonText, { color: colors.text }]}>
                Previous
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              { backgroundColor: nextButtonBg },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.nextButtonText, { color: '#fff' }]}>
              {currentStep === welcomeSteps.length - 1
                ? 'Get Started! 🎉'
                : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {isClient ? (
        <GestureDetector gesture={gesture}>{content}</GestureDetector>
      ) : (
        content
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  stepContainer: {
    width: screenWidth - 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    minHeight: 260,
  },
  emojiContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
    zIndex: 10,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    alignSelf: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 25,
  },
  progressBar: {
    width: '60%',
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  navButton: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    minWidth: 120,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  prevButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  nextButton: {
    flex: 1,
    marginLeft: 15,
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default WelcomeScreen;
