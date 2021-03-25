import "./ArticleOverlay.css";
import Card from "./Card.js";
import SwipeArticle from "./SwipeArticle.js"
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import useWindowDimensions from "./windowsize";
import {getData, postData} from "./xmlhttprequest";
import image_1 from './res/image_1.png';
import image_2 from './res/horizontal.png';
import image_3 from './res/vertical_image.png';
import image_liked from './res/image_like.png';
import arrow_up from './res/arrow_up.svg';
import close_button from './res/close_button.png';



function ArticleOverlay() {
  const domain = "http://localhost:8000";
  const NUM_CARDS = 3;

  const WINDOW_SIZE = useWindowDimensions();
  const DRAG_LEFT_THRESHOLD = WINDOW_SIZE.width/3.5;
  const DRAG_RIGHT_THRESHOLD = WINDOW_SIZE.width/4.5;
  const SWIPED_CARDS_OFFSET = WINDOW_SIZE.width;
  const MAGIC_MULTIPLIER = 1.5;
  const MAGIC_MULTIPLIER_VERTICAL = 14;
  const MAGIC_MULTIPLIER_ROTATE = 3;
  const OPACITY_TRANSITION = 0.35;
  const TRANSFORM_TRANSITION = 0.25;

  const [index, setIndex] = useState(0);
  // const [index_changed, setIndexChanged] = useState(0);
  const [swipeStyles, setSwipeStyles] = useState(Array(NUM_CARDS).fill({ opacity: 0 }, 1));
  const [indexView, setIndexView] = useState(-1);
  const [articles, setArticles] = useState(Array(NUM_CARDS).fill(null));

  useEffect(() => {
    fetch(`${domain}/news`, {
      // method: "POST", // or 'PUT'
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify(data),
    })
      .then((results) => results.json())
      .then((data) => {
        console.log("SUCCESS");
        console.log(data);
        setArticles(data);
      });
  }, []);

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
        if (movement[0] <= -2 && index < NUM_CARDS-1) {
          // update movement of card to the left
          if (index > 0) {
            newSwipeStyles[index-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, ${-MAGIC_MULTIPLIER_VERTICAL}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE}deg)`, opacity: 0, };
          }
          set({ x: movement[0] });
          newSwipeStyles[index] = { transform: x.interpolate((x) => `translate3d(${x}px, ${MAGIC_MULTIPLIER_VERTICAL*(movement[0])/SWIPED_CARDS_OFFSET}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE*(-movement[0])/SWIPED_CARDS_OFFSET}deg)`), opacity: `${1 - (MAGIC_MULTIPLIER*(-movement[0])/SWIPED_CARDS_OFFSET)}`};
          newSwipeStyles[index+1] = { opacity: MAGIC_MULTIPLIER*(-movement[0])/SWIPED_CARDS_OFFSET};
          setSwipeStyles(newSwipeStyles);

        } else if (index > 0 && movement[0] >= 2) {
          // update movement of previous card to the right
          newSwipeStyles[index] = { transform: `translate3d(0px, 0px, 0px)`, opacity: 1-(movement[0]/SWIPED_CARDS_OFFSET)};
          // set({ x: -SWIPED_CARDS_OFFSET + movement[0] });
          newSwipeStyles[index-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET + movement[0]}px, ${MAGIC_MULTIPLIER*(-movement[0]/SWIPED_CARDS_OFFSET/MAGIC_MULTIPLIER_VERTICAL)}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE*(1 - movement[0]/SWIPED_CARDS_OFFSET)}deg)`, opacity: `${MAGIC_MULTIPLIER*movement[0]/SWIPED_CARDS_OFFSET}`};
          setSwipeStyles(newSwipeStyles);
        }

      } else if (movement[0] < -DRAG_LEFT_THRESHOLD && index < NUM_CARDS-1) {
        // drag to the left
        set({ x: 0 });
        newSwipeStyles[index] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, ${-MAGIC_MULTIPLIER_VERTICAL}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE}deg)`, opacity: 0, transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`};
        if (index<NUM_CARDS-1) {
          newSwipeStyles[index+1] = { opacity: 1};
        }
        setSwipeStyles(newSwipeStyles);
        setIndex(index+1);

      } else if (movement[0] > DRAG_RIGHT_THRESHOLD && index > 0) {
        // drag to the right
        set({ x: 0 });
        newSwipeStyles[index-1] = { transform: `translate3d(0px, 0px, 0px)`, opacity: 1, transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`};
        newSwipeStyles[index] = { opacity: 0};
        setSwipeStyles(newSwipeStyles);
        setIndex(index-1);
        
      } else if (movement[0] >= 2 && index > 0) {
        // never drag right enough
        set({ x: 0 });
        newSwipeStyles[index-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, ${-MAGIC_MULTIPLIER_VERTICAL}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE}deg)`, transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out` };
        newSwipeStyles[index] = { opacity: 1};
        setSwipeStyles(newSwipeStyles);

      } else if (movement[0] <= -2 && index < NUM_CARDS-1) {
        // never drag left enough
        set({ x: 0 });
        newSwipeStyles[index] = { transform: x.interpolate((x) => `translate3d(${x}px, 0px, 0px)`), transition: `opacity ${OPACITY_TRANSITION}s ease-out`};
        newSwipeStyles[index + 1] = { opacity: 0};
        setSwipeStyles(newSwipeStyles);
      }
      

      console.log(index);
    },
    {
      bounds: { left: -SWIPED_CARDS_OFFSET, right: SWIPED_CARDS_OFFSET, top: 0, bottom: 0 },
    }
  );

  // var cards = [];
  // for (var i = 0; i < numrows; i++) {
  //   // note: we are adding a key prop here to allow react to uniquely identify each
  //   // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
  //   rows.push(<ObjectRow key={i} />);
  //   }
  //   <tbody>{rows}</tbody>;
    
    

  return (
    <div className="article_overlay" >
      <div className="swipeup_container">
      <div className="card_view">
      <animated.div className="overlay-cards_container" {...bind()}>
      {/* {articles.map((object, i) => <Card category={object.section} title={object.title} summary={object.content} style={swipeStyles[i]} image={object.image} counter={i} />)} */}
        <Card category="Entertainment" title="Gina Carano fired from The Mandalorian over offensive social media posts" summary="Gina Carano has been axed from The Mandalorian after she shared a few posts on Instagram Stories that compared being a Republican today to being Jewish during the Holocaust.The hashtag #FireGinaCarano trended online after her post, putting pressure onto Disney to drop the 38-year-old actress from the series." style={swipeStyles[2]} image={image_3} counter="3/10" />
        <Card category="Entertainment" title="K-pop for the planet: Fans of South Korean stars take up climate activism" summary="      JAKARTA — From petitioning to save forests to raising cash for disaster victims, a growing army of K-pop fans worldwide has emerged as the latest force in the global fight against climate change." style={swipeStyles[1]} image={image_2} counter="2/10"/>
        <Card category="TheBigRead" title="The Big Read: Goodbye T-score, goodbye PSLE stress? Not so fast, as anxious parents size up new scoring system" summary="The PSLE T-score system, which has been around for six decades, will be scrapped after this year. The impending change has garnered mixed reactions, with some parents saying it reduces unhealthy competition, while others are concerned it may add to the stre." style={swipeStyles[0]} view={false} image={image_1} counter="1/10"/>
      </animated.div>
      <div className="overlay-buttons">
        {/* <div className="button"></div> */}
        <div className="read_more-button" onClick={() => {
            document.getElementsByClassName("swipeup_container")[0].classList.add("swiped_up");
        }}
        >
          <img src={arrow_up}></img>
          Swipe to Read More
        </div>
        {/* <div className="button like_button"><img src={image_liked}></img></div> */}
      </div>
      <div className="close_overlay">
        <img src={close_button}/>
      </div>
      </div>
      <SwipeArticle html_render={"hello world"}/>
      </div>
    </div>
  );
}

export default ArticleOverlay;
