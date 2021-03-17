import {cardWidth, cardHeight, verticalSpacing, left} from '../../helpers';

export default index => {
  return {
    holder: {
      position: 'absolute',
      width: cardWidth,
      height: cardHeight,
      left: left,
      top: index * (cardHeight + verticalSpacing),
      zIndex: 10,
      backgroundColor: 'purple',
    },

    image: {
      width: cardWidth,
      height: cardHeight,
    },
  };
};