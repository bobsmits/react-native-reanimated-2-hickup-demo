import {Dimensions} from 'react-native';

export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;

export const cardWidth = screenWidth * 0.9;
export const cardHeight = (cardWidth * 4) / 3;
export const left = (screenWidth - cardWidth) / 2;
export const verticalSpacing = 60;
export const swipeThreshold = 50;

export const cardY = index => {
  'worklet';
  return -index * (cardHeight + verticalSpacing);
};

export const deckSpringConfig = () => {
  'worklet';

  return {
    stiffness: 4000,
    damping: 500,
    mass: 0.5,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };
};
