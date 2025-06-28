import { useState, useCallback } from 'react';
import { useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { ANIMATION_CONFIG, SWIPE_CONFIG } from '../constants/cardConfig';

export type ContentStep = 'meaning' | 'explanation' | 'examples';

export const useCardFlip = () => {
  const rotation = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentStep, setCurrentStep] = useState<ContentStep>('meaning');

  const handleFlip = useCallback(() => {
    rotation.value = withSpring(isFlipped ? 0 : 1, ANIMATION_CONFIG.FLIP);
    setIsFlipped(!isFlipped);
  }, [isFlipped, rotation]);

  const handleStepChange = useCallback((step: ContentStep) => {
    setCurrentStep(step);
  }, []);

  const handleSwipeRight = useCallback(() => {
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
  }, [isFlipped, currentStep, handleFlip]);

  const handleSwipeLeft = useCallback(() => {
    if (isFlipped) {
      if (currentStep === 'examples') {
        setCurrentStep('explanation');
      } else if (currentStep === 'explanation') {
        setCurrentStep('meaning');
      } else if (currentStep === 'meaning') {
        handleFlip();
      }
    }
  }, [isFlipped, currentStep, handleFlip]);

  const swipeGesture = Gesture.Pan()
    .minDistance(SWIPE_CONFIG.MIN_DISTANCE)
    .activeOffsetX([-15, 15])
    .failOffsetY([-60, 60])
    .maxPointers(1)
    .shouldCancelWhenOutside(true)
    .runOnJS(true)
    .onEnd((event) => {
      const { velocityX, translationX, translationY } = event;

      const isStrictlyHorizontal =
        Math.abs(translationX) > Math.abs(translationY) * 1.5 &&
        Math.abs(translationX) > 40;

      if (
        isStrictlyHorizontal &&
        (Math.abs(translationX) > SWIPE_CONFIG.THRESHOLD ||
          Math.abs(velocityX) > SWIPE_CONFIG.VELOCITY_THRESHOLD)
      ) {
        if (translationX > 0) {
          runOnJS(handleSwipeRight)();
        } else {
          runOnJS(handleSwipeLeft)();
        }
      }
    });

  return {
    rotation,
    isFlipped,
    currentStep,
    handleFlip,
    handleStepChange,
    swipeGesture,
  };
};
