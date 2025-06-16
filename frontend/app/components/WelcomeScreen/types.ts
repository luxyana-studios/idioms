import { useTheme } from '../../contexts/ThemeContext';
import { SharedValue } from 'react-native-reanimated';

export interface WelcomeScreenProps {
  onComplete: () => void;
}

export interface WelcomeStep {
  title: string;
  subtitle: string;
  animation: AnimationType;
}

export type AnimationType = 'welcome' | 'tap' | 'scroll' | 'start';

export interface AnimationComponentProps {
  colors: ReturnType<typeof useTheme>['colors'];
  width: number;
  height: number;
  currentStep: number;
  cardFlipped: boolean;
  flipCard: () => void;
}

export interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  colors: ReturnType<typeof useTheme>['colors'];
  dotSize?: number;
  spacing?: number;
  animationDuration?: number;
  activeScale?: number;
}

export interface BackgroundStarsProps {
  colors: ReturnType<typeof useTheme>['colors'];
  width: number;
  height: number;
  starsOpacity: SharedValue<number>;
}
