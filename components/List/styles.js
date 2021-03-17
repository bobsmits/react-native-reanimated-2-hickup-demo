import {cardHeight, screenHeight, verticalSpacing} from '../..//helpers';

export default cardsCount => {
  return {
    holder: {
      height: cardsCount * (cardHeight + verticalSpacing),
      width: '100%',
      top: (screenHeight - cardHeight) / 2,
      position: 'absolute',
    },

    cards: {
      height: '100%',
      width: '100%',
      position: 'absolute',
    },
  };
};
