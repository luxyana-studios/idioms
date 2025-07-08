import { useState, useEffect, memo } from 'react';
import { View, Dimensions, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { CardData } from '../types/card';
import CardFront from './CardFront';
import CardBack from './CardBack';

const SCREEN_DIMENSIONS = Dimensions.get('window');
const CARD_WIDTH = SCREEN_DIMENSIONS.width * 0.88;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height * 0.75;

interface CardProps {
  item: CardData;
  onFavoritePress: (id: string) => void;
  onVotePress: (id: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  visible?: boolean;
}

export type ContentStep = 'meaning' | 'explanation' | 'examples';

const CardComponent = ({
  item,
  onFavoritePress,
  onVotePress,
  visible = false,
}: CardProps) => {
  // flip rotation
  const rotation = useSharedValue(0);
  // simple scale animation for entry
  const scale = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);
  // flip state
  const [isFlipped, setIsFlipped] = useState(false);
  // current step for back navigation
  const [currentStep, setCurrentStep] = useState<ContentStep>('meaning');

  const entryStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // animate when card becomes visible with simple scale animation
  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
      opacity.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
    } else {
      scale.value = withSpring(0.8, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
      opacity.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
    }
  }, [visible, scale, opacity]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1, 2], [0, -180, -360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [-180, -360]);
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

  const handleSwipeNext = () => {
    if (!isFlipped) {
      handleFlip();
      setCurrentStep('meaning');
    } else {
      if (currentStep === 'meaning') {
        setCurrentStep('explanation');
      } else if (currentStep === 'explanation') {
        setCurrentStep('examples');
      } else if (currentStep === 'examples') {
        rotation.value = withSpring(2, { damping: 10, stiffness: 100 });
        setIsFlipped(false);
        setTimeout(() => setCurrentStep('meaning'), 300);
      }
    }
  };

  const handleSwipePrev = () => {
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
        if (translationX < 0) {
          runOnJS(handleSwipeNext)();
        } else {
          runOnJS(handleSwipePrev)();
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
        <View
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            overflow: 'hidden',
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
              CARD_WIDTH={CARD_WIDTH}
              CARD_HEIGHT={CARD_HEIGHT}
              backAnimatedStyle={backAnimatedStyle}
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />
          )}
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

// memoized to prevent re-render when props didn't change
const MemoizedCard = memo(CardComponent, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.visible === nextProps.visible
  );
});

MemoizedCard.displayName = 'Card';

export { MemoizedCard as Card };
export default MemoizedCard;
