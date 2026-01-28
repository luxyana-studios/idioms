import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useBlobFloating } from '../hooks/useFloatingAnimation';

interface BlobShapeProps {
  size?: number;
  color?: string;
  opacity?: number;
  style?: ViewStyle;
  animated?: boolean;
  index?: number;
  variant?: 'round' | 'organic1' | 'organic2' | 'organic3';
}

/**
 * Organic blob shape component for decorative backgrounds.
 * Organic Flow: irregular, natural-feeling shapes that float gently.
 */
const BlobShape: React.FC<BlobShapeProps> = ({
  size = 100,
  color = '#A7C4A0', // Default sage green
  opacity = 0.15,
  style,
  animated = true,
  index = 0,
  variant = 'organic1',
}) => {
  const floatingStyle = useBlobFloating(index, animated);

  // Different organic blob shapes using borderRadius variations
  const getBlobBorderRadius = () => {
    switch (variant) {
      case 'round':
        return size / 2;
      case 'organic1':
        // Blob: 60% 40% 50% 50% / 45% 55% 45% 55%
        return {
          borderTopLeftRadius: size * 0.6,
          borderTopRightRadius: size * 0.4,
          borderBottomLeftRadius: size * 0.5,
          borderBottomRightRadius: size * 0.5,
        };
      case 'organic2':
        // Blob: 40% 60% 55% 45% / 55% 45% 50% 50%
        return {
          borderTopLeftRadius: size * 0.4,
          borderTopRightRadius: size * 0.6,
          borderBottomLeftRadius: size * 0.55,
          borderBottomRightRadius: size * 0.45,
        };
      case 'organic3':
        // Blob: 50% 50% 40% 60% / 60% 40% 55% 45%
        return {
          borderTopLeftRadius: size * 0.5,
          borderTopRightRadius: size * 0.5,
          borderBottomLeftRadius: size * 0.4,
          borderBottomRightRadius: size * 0.6,
        };
      default:
        return size / 2;
    }
  };

  const borderRadiusStyle =
    typeof getBlobBorderRadius() === 'number'
      ? { borderRadius: getBlobBorderRadius() as number }
      : (getBlobBorderRadius() as object);

  const blobStyle: ViewStyle = {
    width: size,
    height: size,
    backgroundColor: color,
    opacity,
    ...borderRadiusStyle,
    ...style,
  };

  if (animated) {
    return <Animated.View style={[blobStyle, floatingStyle]} />;
  }

  return <View style={blobStyle} />;
};

export const MemoizedBlobShape = memo(BlobShape);
MemoizedBlobShape.displayName = 'BlobShape';

export default MemoizedBlobShape;
