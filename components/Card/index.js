import React from 'react';
import generatedStyles from './styles';
import FastImage from 'react-native-fast-image';
import {cardHeight, cardWidth} from '../../helpers';
import Reanimated, {useAnimatedGestureHandler} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const yFactor = 1.428;

export default function Card({
  index,
  cardId,
  onVerticalMove,
  onVerticalRelease,
}) {
  const handler = useAnimatedGestureHandler(
    {
      onStart: (evt, ctx) => {
        'worklet';
        ctx.isHorizontalMove = false;
        ctx.isVerticalMove = false;
      },

      onActive: (evt, ctx) => {
        'worklet';
        if (ctx.isHorizontalMove) {
          // Removed for demo
        } else if (ctx.isVerticalMove) {
          onVerticalMove(evt.translationY);
        } else if (
          Math.abs(evt.velocityX) >= Math.abs(evt.velocityY / yFactor)
        ) {
          ctx.isHorizontalMove = true;
          // Removed for demo
        } else {
          ctx.isVerticalMove = true;
          onVerticalMove(evt.translationY);
        }
      },

      onEnd: (evt, ctx) => {
        'worklet';
        if (ctx.isVerticalMove) {
          onVerticalRelease(evt.translationY);
        } else if (ctx.isHorizontalMove) {
          // Removed for demo
        }
      },
    },
    // [true], // Remove this to fix the stutters
  );

  const styles = generatedStyles(index);

  return (
    <PanGestureHandler minDist={4} onGestureEvent={handler}>
      <Reanimated.View style={styles.holder}>
        <FastImage
          style={styles.image}
          source={{
            uri: `https://picsum.photos/seed/${cardId}/${Math.round(
              cardWidth,
            )}/${Math.round(cardHeight)}`,
          }}
          resizeMode={'contain'}
        />
      </Reanimated.View>
    </PanGestureHandler>
  );
}
