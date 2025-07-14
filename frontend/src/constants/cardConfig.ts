import { Dimensions } from 'react-native';

const SCREEN_DIMENSIONS = Dimensions.get('window');

export const CARD_DIMENSIONS = {
  WIDTH: SCREEN_DIMENSIONS.width * 0.85,
  HEIGHT: SCREEN_DIMENSIONS.height * 0.75,
  ITEM_HEIGHT: SCREEN_DIMENSIONS.height * 0.75 + 30,
} as const;

export const ANIMATION_CONFIG = {
  FLIP: {
    damping: 10,
    stiffness: 100,
  },
  ENTRY: {
    damping: 12,
    stiffness: 120,
  },
  BASE_DELAY: 30,
  MAX_DELAY: 300,
} as const;

export const SWIPE_CONFIG = {
  MIN_DISTANCE: 50,
  ACTIVE_OFFSET_X: [-15, 15],
  FAIL_OFFSET_Y: [-60, 60],
  THRESHOLD: 80,
  VELOCITY_THRESHOLD: 600,
} as const;
