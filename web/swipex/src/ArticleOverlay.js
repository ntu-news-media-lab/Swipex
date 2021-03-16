import "./ArticleOverlay.css";
import Card from "./Card.js";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import useWindowDimensions from "./windowsize";



function ArticleOverlay() {
  const WINDOW_SIZE = useWindowDimensions();
  const DRAG_LEFT_THRESHOLD = WINDOW_SIZE.width/4;
  const DRAG_RIGHT_THRESHOLD = WINDOW_SIZE.width/6;
  const SWIPED_CARDS_OFFSET = WINDOW_SIZE.width;
  const MAGIC_MULTIPLIER = 1.5;


  const [index, setIndex] = useState(0);
  const [index_changed, setIndexChanged] = useState(0);
  const [swipeStyles, setSwipeStyles] = useState(Array(10).fill(null));


  const article_length = 3;



  const [{ x, opacity }, set] = useSpring(() => ({
    x: 0,
  }));

  const bind = useDrag(
    ({ down, movement }) => {
      // console.log(down, movement); // whether finger is down on the screen, swipe right and below is positive (x,y) movement
      const newSwipeStyles = swipeStyles.slice();
      var new_move = movement[0];
      var old_move = new_move;
      console.log(down, movement[0]);

      if (down) {
        old_move = new_move;
        new_move = movement[0];
        if (movement[0] <= -2 && index < article_length-1) {
          // update movement of card to the left
          if (index > 0) {
            newSwipeStyles[index-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, 0px, 0px)`, opacity: 0, };
          }
          set({ x: movement[0] });
          newSwipeStyles[index] = { transform: x.interpolate((x) => `translate3d(${x}px, 0px, 0px)`), opacity: `${1 - (MAGIC_MULTIPLIER*(-movement[0])/SWIPED_CARDS_OFFSET)}`, transition: `opacity 0.3s`};
          setSwipeStyles(newSwipeStyles);

        // } else if (index > 0 && movement[0] <= 0) {
        //   // do nothing
        //   set({ x: movement[0] });
        //   newSwipeStyles[index] = { transform: `translate3d(${movement[0]}px, 0px, 0px)`};
        //   setSwipeStyles(newSwipeStyles);

        // } else if (index > 0 && movement[0] <= 5) {
        //   // do nothing
        //   set({ x: -SWIPED_CARDS_OFFSET + movement[0] });
        //   newSwipeStyles[index-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET + movement[0]}px, 0px, 0px)`, opacity: 0 };
        //   setSwipeStyles(newSwipeStyles);

        } else if (index > 0 && movement[0] >= 2) {
          // update movement of previous card to the right
          newSwipeStyles[index] = { transform: `translate3d(0px, 0px, 0px)`, opacity: 1 };
          // set({ x: -SWIPED_CARDS_OFFSET + movement[0] });
          newSwipeStyles[index-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET + movement[0]}px, 0px, 0px)`, opacity: `${MAGIC_MULTIPLIER*movement[0]/SWIPED_CARDS_OFFSET}`, transition: `opacity 0.3s`};
          setSwipeStyles(newSwipeStyles);
        }

      } else if (movement[0] < -DRAG_LEFT_THRESHOLD && (index < article_length-1)) {
        // drag to the left
        set({ x: 0 });
        newSwipeStyles[index] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, 0px, 0px)`, opacity: 0, transition: `transform 0.3s, opacity 0.3s`};
        setSwipeStyles(newSwipeStyles);
        setIndex(index+1);

      } else if (movement[0] > DRAG_RIGHT_THRESHOLD && index > 0) {
        // drag to the right
        set({ x: 0 });
        newSwipeStyles[index-1] = { transform: `translate3d(0px, 0px, 0px)`, opacity: 1, transition: `transform 0.25s, opacity 0.25s`};
        setSwipeStyles(newSwipeStyles);
        setIndex(index-1);
        
      } else if (movement[0] >= 2 && index > 0) {
        // never drag right enough
        set({ x: -SWIPED_CARDS_OFFSET });
        newSwipeStyles[index-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, 0px, 0px)`, transition: `transform 0.2s, opacity 0.3s` };
        setSwipeStyles(newSwipeStyles);

      } else if (movement[0] <= -2) {
        // never drag left enough
        set({ x: 0 });
        newSwipeStyles[index] = { transform: x.interpolate((x) => `translate3d(${x}px, 0px, 0px)`) };
        setSwipeStyles(newSwipeStyles);
      }
      

      console.log(index);
    },
    {
      bounds: { left: -SWIPED_CARDS_OFFSET, right: SWIPED_CARDS_OFFSET, top: 0, bottom: 0 },
    }
  );

  return (
    <div className="article_overlay">
      <animated.div className="overlay-cards_container" {...bind()}>
        <Card category="entertainment" content="3" style={swipeStyles[2]}/>
        <Card category="sports" content="2" style={swipeStyles[1]}/>
        <Card category="politics" content="1" style={swipeStyles[0]} view={false} />
      </animated.div>
      <div className="overlay-buttons">buttons goes here</div>
    </div>
  );
}

export default ArticleOverlay;