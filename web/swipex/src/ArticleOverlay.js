import "./ArticleOverlay.css";
import Card from "./Card.js";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import useWindowDimensions from "./windowsize";
import image_1 from './res/image_1.png';
import image_2 from './res/image_2.png';
import image_3 from './res/image_3.png';
import image_like from './res/image_like_1.png';



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
    <div className="article_overlay" >
      <animated.div className="overlay-cards_container" {...bind()}>
        <Card category="Entertainment" title="Gina Carano fired from The Mandalorian over offensive social media posts" summary="Gina Carano has been axed from The Mandalorian after she shared a few posts on Instagram Stories that compared being a Republican today to being Jewish during the Holocaust.The hashtag #FireGinaCarano trended online after her post, putting pressure onto Disney to drop the 38-year-old actress from the series." style={swipeStyles[2]} image={image_3}/>
        <Card category="Crime & Accidents" title="Police probing two related unnatural deaths after duo found motionless at Tampines, Punggol blocks" summary="SINGAPORE — The police are investigating two related unnatural deaths after a woman was found motionless at the void deck of a public housing block in Tampines on Wednesday (Feb 10). An image of an official document and a photo of the woman have been making their rounds online and on messaging platforms.The police urged the public to refrain from circulating them out of respect for the deceased and their aggrieved families." style={swipeStyles[1]} image={image_2}/>
        <Card category="TheBigRead" title="The Big Read: Goodbye T-score, goodbye PSLE stress? Not so fast, as anxious parents size up new scoring system" summary="The PSLE T-score system, which has been around for six decades, will be scrapped after this year. The impending change has garnered mixed reactions, with some parents saying it reduces unhealthy competition, while others are concerned it may add to the stre." style={swipeStyles[0]} view={false} image={image_1}/>
      </animated.div>
      <div className="overlay-buttons">
        <div className="button like-button"><img src={image_like}></img></div>
      </div>
    </div>
  );
}

export default ArticleOverlay;
