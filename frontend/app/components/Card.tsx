import { memo } from 'react';
import { View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

import { CardData } from '../types/card';
import CardFront from './CardFront';
import { CardBack } from './CardBack';
import { useCardFlip } from '../hooks/useCardFlip';
import { useCardEntryAnimation } from '../hooks/useCardEntryAnimation';
import { CARD_DIMENSIONS } from '../constants/cardConfig';

interface CardProps {
  item: CardData;
  onFavoritePress: (id: string) => void;
  onVotePress: (id: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  visible?: boolean;
  scrollDown?: boolean;
  index?: number;
}

export const Card = ({
  item,
  onFavoritePress,
  onVotePress,
  visible = false,
  scrollDown = false,
  index = 0,
}: CardProps) => {
  const {
    rotation,
    isFlipped,
    currentStep,
    handleFlip,
    handleStepChange,
    swipeGesture,
  } = useCardFlip();

  const { entryStyle } = useCardEntryAnimation({ visible, scrollDown, index });
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

  const handleFavoritePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onFavoritePress?.(item.id);
  };

  return (
    <Animated.View
      style={entryStyle}
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      collapsable={false}
      className="m-4"
    >
      <GestureDetector gesture={swipeGesture}>
        <TouchableOpacity onPress={handleFlip} activeOpacity={1}>
          <View
            style={{
              width: CARD_DIMENSIONS.WIDTH,
              height: CARD_DIMENSIONS.HEIGHT,
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
                CARD_WIDTH={CARD_DIMENSIONS.WIDTH}
                CARD_HEIGHT={CARD_DIMENSIONS.HEIGHT}
                frontAnimatedStyle={frontAnimatedStyle}
              />
            ) : (
              <CardBack
                item={item}
                CARD_WIDTH={CARD_DIMENSIONS.WIDTH}
                CARD_HEIGHT={CARD_DIMENSIONS.HEIGHT}
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

export default memo(Card);
