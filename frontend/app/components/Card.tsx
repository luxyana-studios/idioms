import { useState, useEffect, memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { CardData } from '../types/card';
import CardFront from './CardFront';
import { CardBack } from './CardBack';

const SCREEN_DIMENSIONS = Dimensions.get('window');
const CARD_WIDTH = SCREEN_DIMENSIONS.width * 0.85;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height * 0.75;

interface CardProps {
  item: CardData;
  onFavoritePress: (id: string) => void;
  onVotePress: (id: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  visible?: boolean;
  scrollDown?: boolean;
}

export type ContentStep = 'meaning' | 'explanation' | 'examples';

export const Card = ({
  item,
  onFavoritePress,
  onVotePress,
  visible = false,
  scrollDown = false,
  index = 0,
}: CardProps & { index?: number }) => {
  // flip rotation
  const rotation = useSharedValue(0);
  // entry animation values
  const entry = useSharedValue(0);
  // flip state
  const [isFlipped, setIsFlipped] = useState(false);
  // current step for back navigation
  const [currentStep, setCurrentStep] = useState<ContentStep>('meaning');

  // memoize random offsets so they do not change on each render
  const { randomAngle, randomX, randomY } = useMemo(
    () => ({
      randomAngle: Math.random() * 20 - 10,
      randomX: Math.random() * 40 - 20,
      randomY: Math.random() * 40 + 20,
    }),
    [],
  );

  const entryStyle = useAnimatedStyle(() => ({
    opacity: entry.value,
    transform: [
      { translateX: interpolate(entry.value, [0, 1], [randomX, 0]) },
      { translateY: interpolate(entry.value, [0, 1], [randomY, 0]) },
      { rotateZ: `${interpolate(entry.value, [0, 1], [randomAngle, 0])}deg` },
    ],
  }));

  // animate when card becomes visible
  useEffect(() => {
    if (!visible) return;
    if (!scrollDown) {
      // immediately show when scrolling up
      entry.value = 1;
    } else {
      // animate on scroll down
      const baseDelay = 30;
      const delay = Math.min(index * baseDelay, 300);
      entry.value = withDelay(
        delay,
        withSpring(1, { damping: 12, stiffness: 120 }),
      );
    }
  }, [visible, scrollDown, index, entry]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const handleFlip = () => {
    rotation.value = withSpring(isFlipped ? 0 : 1, {
      damping: 10,
      stiffness: 100,
    });
    setIsFlipped(!isFlipped);
  };

  const handleFavoritePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onFavoritePress?.(item.id);
  };

  const handleStepChange = (step: ContentStep) => {
    setCurrentStep(step);
  };

  const handleSwipeRight = () => {
    if (!isFlipped) {
      handleFlip();
      setCurrentStep('meaning');
    } else {
      if (currentStep === 'meaning') {
        setCurrentStep('explanation');
      } else if (currentStep === 'explanation') {
        setCurrentStep('examples');
      } else if (currentStep === 'examples') {
        handleFlip();
        setTimeout(() => setCurrentStep('meaning'), 300);
      }
    }
  };

  const handleSwipeLeft = () => {
    if (isFlipped) {
      if (currentStep === 'examples') {
        setCurrentStep('explanation');
      } else if (currentStep === 'explanation') {
        setCurrentStep('meaning');
      } else if (currentStep === 'meaning') {
        handleFlip();
      }
    }
  };

  // Gesture handlers
  const swipeGesture = Gesture.Pan()
    .minDistance(50)
    .activeOffsetX([-15, 15])
    .failOffsetY([-60, 60])
    .maxPointers(1)
    .shouldCancelWhenOutside(true)
    .runOnJS(true)
    .onEnd((event) => {
      const { velocityX, translationX, translationY } = event;
      const swipeThreshold = 80;
      const velocityThreshold = 600;

      const isStrictlyHorizontal =
        Math.abs(translationX) > Math.abs(translationY) * 1.5 &&
        Math.abs(translationX) > 40;

      if (
        isStrictlyHorizontal &&
        (Math.abs(translationX) > swipeThreshold ||
          Math.abs(velocityX) > velocityThreshold)
      ) {
        if (translationX > 0) {
          runOnJS(handleSwipeRight)();
        } else {
          runOnJS(handleSwipeLeft)();
        }
      }
    });

  return (
    <Animated.View
      style={entryStyle}
      // GPU render optimization flags
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      collapsable={false}
      className="m-4"
    >
      <GestureDetector gesture={swipeGesture}>
        <TouchableOpacity onPress={handleFlip} activeOpacity={1}>
          <View
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {!isFlipped ? (
              <CardFront
                item={item}
                handleFavoritePress={handleFavoritePress}
                onVotePress={onVotePress}
                CARD_WIDTH={CARD_WIDTH}
                CARD_HEIGHT={CARD_HEIGHT}
                frontAnimatedStyle={frontAnimatedStyle}
              />
            ) : (
              <CardBack
                item={item}
                handleFavoritePress={handleFavoritePress}
                CARD_WIDTH={CARD_WIDTH}
                CARD_HEIGHT={CARD_HEIGHT}
                backAnimatedStyle={backAnimatedStyle}
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />
            )}
          </View>
        </TouchableOpacity>
      </GestureDetector>
    </Animated.View>
  );
};

// memoized to prevent re-render when props didn't change
export default memo(Card);
