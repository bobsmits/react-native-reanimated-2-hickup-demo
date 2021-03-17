import React, {useRef, useMemo, useState} from 'react';
import {View} from 'react-native';
import Card from '../Card';
import generateStyles from './styles';
import {deckSpringConfig, cardY, swipeThreshold} from '../../helpers';
import Reanimated, {
  Easing,
  useSharedValue,
  runOnJS,
  withTiming,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';

const List = () => {
  const cards = [1, 2, 3, 4, 5, 6, 7, 8];

  const listPosition = useSharedValue(0);
  const activeIndex = useSharedValue(0);
  const [activeIndexState, setActiveIndexState] = useState(0);

  const listLength = useSharedValue(cards.length);
  const handleChange = newIndex => {
    setActiveIndexState(newIndex);
  };

  /**
   * As the worklet methods are cached they do not point to the latest
   * version of the handleCardChange method. So we call the onChangeCallbackFromReanimated
   * first that call the latest version stored in the ref
   */
  const latestHandleChange = useRef();
  latestHandleChange.current = handleChange;

  const handleChangeCallBackFromReanimated = newIndex => {
    if (latestHandleChange.current) latestHandleChange.current(newIndex);
  };

  /**
   * NOTE: Card deck worklet methods a cached and can not have local variables
   */
  const animateToY = y => {
    'worklet';
    listPosition.value = withTiming(y, {
      duration: 230,
      easing: Easing.out(Easing.cubic),
    });
  };

  /**
   * NOTE: Card deck worklet methods a cached and can not have local variables
   */
  const moveToIndex = (index, options = {animate: true}) => {
    'worklet';
    if (index < 0) index = 0;
    if (index > listLength.value - 1) index = listLength.value - 1;

    activeIndex.value = index;

    runOnJS(handleChangeCallBackFromReanimated)(activeIndex.value);

    animateToY(cardY(index));
  };

  /**
   * NOTE: Card deck worklet methods a cached and can not have local variables
   */
  const onVerticalRelease = dy => {
    'worklet';
    let newIndex = activeIndex.value;

    if (dy < -swipeThreshold) {
      newIndex += 1;
    } else if (dy > swipeThreshold) {
      newIndex -= 1;
    }

    moveToIndex(newIndex);
  };

  /**
   * NOTE: Card deck worklet methods a cached and can not have local variables
   */
  const onVerticalMove = dy => {
    'worklet';

    // Add friction for the last item
    if (activeIndex.value + 1 === listLength.value && dy < 0) dy *= 0.3;

    // Add friction for the first item
    if (activeIndex.value === 0 && dy > 0) dy *= 0.3;

    listPosition.value = dy + cardY(activeIndex.value);
  };

  const styles = useMemo(() => generateStyles(listLength.value), [
    listLength.value,
  ]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: withSpring(listPosition.value, deckSpringConfig())},
      ],
    };
  });

  const renderCards = () => {
    return cards.map((id, i) => {
      return (
        <Card
          onVerticalMove={onVerticalMove}
          onVerticalRelease={onVerticalRelease}
          index={i}
          visible={i >= activeIndexState - 1 && i <= activeIndexState + 1}
          listPosition={listPosition}
          cardYPosition={cardY(i)}
          key={`card-${i}`}
          cardId={id}
        />
      );
    });
  };

  return (
    <View style={styles.holder}>
      <Reanimated.View style={[styles.cards, animatedStyles]}>
        {renderCards()}
      </Reanimated.View>
    </View>
  );
};

export default List;
