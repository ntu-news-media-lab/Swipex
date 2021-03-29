import "./ArticleOverlay.css";
import today_screenshot from "./res/homepage_proper.png";
import "./WebArticle.css";
import swipeX from "./res/SwipeXbubble.png";
import Card from "./Card.js";
import SwipeArticle from "./SwipeArticle.js"
import { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import { useWindowDimensions, capitalize, usePrevious, uuidv4, getRandomIntInclusive } from "./helpers";
import { getData, postData } from "./xmlhttprequest";
import image_1 from './res/image_1.png';
import image_2 from './res/horizontal.png';
import image_3 from './res/vertical_image.png';
import image_liked from './res/image_like.png';
import arrow_up from './res/arrow_up.svg';
import close_button from './res/close_button.png';
import tutorial_1 from "./res/tutorial_1.svg";
import tutorial_2 from "./res/tutorial_2.svg";
import tutorial_3 from "./res/tutorial_3.svg";
import CardTutorial from "./CardTutorial.js";



function ArticleOverlay() {
  const domain = "http://localhost:8000/";
  const NUM_ARTICLE_CARDS = 10; // max total no. of swipeable article cards
  const REC_THRESHOLD = 5; // calculate preferences when at least 5 cards are viewed and timings noted
  const tutorial_render = [tutorial_1, tutorial_2, tutorial_3];
  const NUM_TUTORIAL_RENDER = tutorial_render.length;
  const CATEGORIES = ["singapore", "world", "big-read"];
  const NUM_CATEGORIES = CATEGORIES.length;
  const READ_TIME_THRESHOLD = 7;
  const MAX_SENSITIVITY_BUFFER = 4;

  const WINDOW_SIZE = useWindowDimensions();
  const DRAG_LEFT_THRESHOLD = WINDOW_SIZE.width / 4.5;
  const DRAG_RIGHT_THRESHOLD = WINDOW_SIZE.width / 4;
  const SWIPED_CARDS_OFFSET = WINDOW_SIZE.width + 16;
  const OPACITY_OFFSET = 0.4;
  const MAGIC_MULTIPLIER = 1.5;
  const MAGIC_MULTIPLIER_VERTICAL = 65;
  const MAGIC_MULTIPLIER_ROTATE = 9;
  const OPACITY_TRANSITION = 0.6;
  const TRANSFORM_TRANSITION = 0.3;

  const [userId, setUserId] = useState(undefined);
  const [userPrefs, setUserPrefs] = useState(undefined);
  const [position, setPosition] = useState(0);
  var prevPosition = usePrevious(position);
  const [swipeStyles, setSwipeStyles] = useState(Array(NUM_ARTICLE_CARDS).fill({ opacity: 0 }, 1));
  const [viewTimings, setViewTimings] = useState({}); //Array(NUM_CARDS).fill({ news_id: undefined, seconds_spent: 0 })
  const [timer, setTimer] = useState(0);
  const [allArticles, setAllArticles] = useState(undefined);
  const [viewArticles, setViewArticles] = useState(undefined);
  const [numTutorialCards, setNumTutorialCards] = useState(0);

  useEffect(() => {
    let user_id;
    let user_prefs;
    let new_all_articles;
    let random_num;
    let new_view_articles = [];

    if (window.localStorage) {
      user_id = window.localStorage.getItem("user_id");
      if (user_id == undefined) {
        setNumTutorialCards(NUM_TUTORIAL_RENDER);
        setSwipeStyles(Array(NUM_ARTICLE_CARDS + NUM_TUTORIAL_RENDER).fill({ opacity: 0 }, 1));
        user_id = uuidv4();
        window.localStorage.setItem("user_id", user_id);
        console.log("creating new user_id...");
      }
      setUserId(user_id);
      console.log(window.localStorage.getItem("user_prefs"), window.localStorage.getItem("user_prefs") == undefined);
      user_prefs = window.localStorage.getItem("user_prefs");
      if (window.localStorage.getItem("user_prefs") == undefined) {
        user_prefs = 0;
      } else {
        user_prefs = JSON.parse(user_prefs);
      }
      setUserPrefs(user_prefs);
    } else {
      alert("Sorry! Your browser does not support the use of local storage! We recommend using either Chrome or Safari!")
    }
    console.log(`user_id:`, user_id);
    console.log(`user_prefs:`, user_prefs);

    fetch(`${domain}news/`, {
      // method: "POST", // or 'PUT'
      // headers: {
      //   "Content-Type": "application/json", TODO: GET userId state to api
      // },
      // body: JSON.stringify(data),
    })
      .then((results) => results.json())
      .then((data) => {
        console.log("Success: /news", data);
        new_all_articles = data.reduce(function (map, obj) {
          map[obj.news_id] = { content: obj.content, headline: obj.headline, image: obj.image, section: obj.section, title: obj.title }
          return map;
        }, {})
        setAllArticles(new_all_articles);
        console.log(new_all_articles);
        // to show only (threshold + 1) articles at first
        let index = 0;
        while (index < REC_THRESHOLD + 1) {
          random_num = getRandomIntInclusive(0, data.length-1);
          if (new_view_articles.includes(random_num)) {
            continue;
          }
          new_view_articles.push(random_num);
          index++;
        }
        setViewArticles(new_view_articles.map((object, i) => ({ content: data[object].headline, headline: data[object].headline, image: data[object].image, news_id: data[object].news_id, section: data[object].section, title: data[object].title })));
      });

  }, []);

  useEffect(() => {
    let new_user_prefs;
    if (prevPosition !== undefined) {
      var new_timings = { ...viewTimings };
      let new_time = ((new Date).getTime() - timer) / 1000;
      if (prevPosition >= numTutorialCards) {
        if (new_timings[viewArticles[prevPosition - numTutorialCards]["news_id"]] == undefined) {
          new_timings[viewArticles[prevPosition - numTutorialCards]["news_id"]] = new_time;
        } else {
          new_timings[viewArticles[prevPosition - numTutorialCards]["news_id"]] += new_time;
        }
        setViewTimings(new_timings);
        if (new_time > READ_TIME_THRESHOLD) {
          // Mark as read
          fetch(`${domain}readers/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              has_read: viewArticles[prevPosition - numTutorialCards]["news_id"],
            }),
          }).catch(console.log("failed to mark as read"))
        }
        setTimer((new Date).getTime());
        console.log(`news_id/position_index: ${viewArticles[prevPosition - numTutorialCards]["news_id"]}/${prevPosition - numTutorialCards}`, `seconds_spent: ${new_timings[viewArticles[prevPosition - numTutorialCards]["news_id"]]}`);
      } else if (position == numTutorialCards) {
        // if there are tutorial cards, start timer for 1st card only when the curent article order is the first article card
        setTimer((new Date).getTime());
      }


      if (userPrefs || Object.keys(new_timings).length >= REC_THRESHOLD) {

        new_user_prefs = CATEGORIES.reduce(function (map, category) {
          map[category] = { score: 0, num_cards: 0, sensitivity_buffer:0 };
          return map;
        }, {});
        console.log(new_timings);
        for (let news_id in new_timings) {
          let category = allArticles[news_id]["section"];
          new_user_prefs[category]["score"] += (new_timings[news_id]) ** (1 / 2); // the more time you read, the less important that additional time spent is
          new_user_prefs[category]["num_cards"] += 1;
          new_user_prefs[category]["sensitivity_buffer"] += 1;
        }
        for (let category in new_user_prefs) {
          if (new_user_prefs[category]["num_cards"] > 0) {
            new_user_prefs[category]["score"] = new_user_prefs[category]["score"] / new_user_prefs[category]["num_cards"]; // weighted by the number of each category that appear
          }
        }
        console.log(new_user_prefs);

        if (userPrefs) {
          // if returning user, modify user prefs
          let old_user_prefs = { ...userPrefs };
          for (let category in old_user_prefs) {
            if (new_user_prefs[category]["sensitivity_buffer"] < MAX_SENSITIVITY_BUFFER) {
              new_user_prefs[category]["score"] = (new_user_prefs[category]["score"] * new_user_prefs[category]["num_cards"] + old_user_prefs[category]["score"] * old_user_prefs[category]["num_cards"])/(new_user_prefs[category]["num_cards"]+old_user_prefs[category]["num_cards"])
              new_user_prefs[category]["sensitivity_buffer"] += 1;
            } else {
              new_user_prefs[category]["score"] = (new_user_prefs[category]["score"] * (MAX_SENSITIVITY_BUFFER-1) + old_user_prefs[category]["score"])/MAX_SENSITIVITY_BUFFER;
            }
            new_user_prefs[category]["num_cards"] += old_user_prefs[category]["num_cards"]; 
          }
          setUserPrefs(new_user_prefs);
        }

        window.localStorage.setItem("user_prefs", JSON.stringify(new_user_prefs));
      }


      if (Object.keys(new_timings).length == position) { // if we swiped 5 articles, our prevPosition was 4, so our position is 5
        // TODO: Filter and the next of the remaining NUM_ARTICLE_CARDS - (REC_THRESHOLD + 1) cards
        // total = Object.values(new_user_prefs).reduce((t, value) => t + value['score'], 0);
        // for (let category in new_user_prefs) {
        //   new_user_prefs[category]["score"] = new_user_prefs[category]["score"]/total; // sum total to be = 1 for better interpretation
        // }
      }


    }
  }, [position]);

  const [{ x }, set] = useSpring(() => ({
    x: 0,
  }));

  const bind = useDrag(
    ({ down, movement }) => {
      // console.log(down, movement); // whether finger is down on the screen, swipe right and below is positive (x,y) movement
      const newSwipeStyles = swipeStyles.slice();
      var new_move = movement[0];

      if (down) {
        if (movement[0] <= -2 && position < NUM_ARTICLE_CARDS+numTutorialCards-1) {
          set({ x: movement[0] });
          newSwipeStyles[position] = { transform: x.interpolate((x) => `translate3d(${x}px, ${-MAGIC_MULTIPLIER_VERTICAL*((movement[0]/SWIPED_CARDS_OFFSET)**2)}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE*((movement[0]/SWIPED_CARDS_OFFSET)**2)}deg)`), opacity: (1-(-movement[0])/SWIPED_CARDS_OFFSET)+OPACITY_OFFSET, zIndex: 1};
          newSwipeStyles[position+1] = { opacity: (-movement[0])/SWIPED_CARDS_OFFSET};
          setSwipeStyles(newSwipeStyles);

        } else if (position > 0 && movement[0] >= 2) {
          // update movement of previous card to the right
          newSwipeStyles[position] = { transform: `translate3d(0px, 0px, 0px)`, opacity: 1-(movement[0]/SWIPED_CARDS_OFFSET)};
          // set({ x: -SWIPED_CARDS_OFFSET + movement[0] });
          newSwipeStyles[position-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET + movement[0]}px, ${-MAGIC_MULTIPLIER_VERTICAL*(1-movement[0]/SWIPED_CARDS_OFFSET)**2}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE*(1-movement[0]/SWIPED_CARDS_OFFSET)**2}deg)`, opacity: (movement[0]/SWIPED_CARDS_OFFSET)+OPACITY_OFFSET, zIndex: 1};
          setSwipeStyles(newSwipeStyles);
        }

      } else if (movement[0] < -DRAG_LEFT_THRESHOLD && position < NUM_ARTICLE_CARDS+numTutorialCards-1) {
        // drag to the left
        set({ x: 0 });
        newSwipeStyles[position] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, ${-MAGIC_MULTIPLIER_VERTICAL}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE}deg)`, opacity: OPACITY_OFFSET, transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 0};
        if (position<NUM_ARTICLE_CARDS+numTutorialCards-1) {
          newSwipeStyles[position+1] = { opacity: 1, transition: `opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 1};
        }
        setSwipeStyles(newSwipeStyles);
        setPosition(position+1);

      } else if (movement[0] > DRAG_RIGHT_THRESHOLD && position > 0) {
        // drag to the right
        set({ x: 0 });
        newSwipeStyles[position-1] = { transform: `translate3d(0px, 0px, 0px) rotate3d(0, 0, 1, 0deg)`, opacity: 1, transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 1};
        newSwipeStyles[position] = { opacity: 0, transition: `opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 0};
        setSwipeStyles(newSwipeStyles);
        setPosition(position-1);
        
      } else if (movement[0] >= 2 && position > 0) {
        // never drag right enough
        set({ x: 0 });
        newSwipeStyles[position-1] = { transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, ${-MAGIC_MULTIPLIER_VERTICAL}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE}deg)`, opacity: OPACITY_OFFSET, transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 0};
        newSwipeStyles[position] = { opacity: 1, transition: `opacity ${OPACITY_TRANSITION}s ease-out`,  zIndex: 1};
        setSwipeStyles(newSwipeStyles);

      } else if (movement[0] <= -2 && position < NUM_ARTICLE_CARDS+numTutorialCards-1) {
        // never drag left enough
        set({ x: 0 });
        newSwipeStyles[position] = { transform: `translate3d(0px, 0px, 0px) rotate3d(0, 0, 1, 0deg)`, transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 1};
        newSwipeStyles[position + 1] = { opacity: 0, transition: `opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 0};
        setSwipeStyles(newSwipeStyles);
      }
      
    },
    {
      bounds: { left: -SWIPED_CARDS_OFFSET, right: SWIPED_CARDS_OFFSET, top: 0, bottom: 0 },
    }
  );
    

  return (
    <div>
      <div className="web_article">
        <img src={today_screenshot} className="img_today_screenshot" />
        <img src={swipeX}
          className="explore_btn"
          onClick={() => {
            document.getElementsByClassName("article_overlay")[0].style.display = "block";
            setTimeout(function () {
              document.getElementsByClassName("article_overlay")[0].classList.add("fadein");
              document.getElementsByTagName("body")[0].classList.add("scroll-lock");
            }, 10);
            if (position >= numTutorialCards) {
              setTimer((new Date).getTime() + 500);
            }
          }}
        />
      </div>

      <div className="article_overlay" >
        <div className="swipeup_container">
          <div className="card_view">
            <animated.div className="overlay-cards_container" {...bind()}>
              {numTutorialCards ? tutorial_render.map((object, i) => <CardTutorial tutorial={object} style={swipeStyles[i]} key={`tut_${i}`} />) : console.log("no tutorial")}
              {viewArticles ? viewArticles.map((object, i) => <Card category={capitalize(object.section)} title={object.title} summary={object.content} style={swipeStyles[i + numTutorialCards]} image={object.image} counter={`${i + 1}/${NUM_ARTICLE_CARDS}`} key={object.news_id} />) : console.log("loading")}
              {/* <Card category="Entertainment" title="Gina Carano fired from The Mandalorian over offensive social media posts" summary="Gina Carano has been axed from The Mandalorian after she shared a few posts on Instagram Stories that compared being a Republican today to being Jewish during the Holocaust.The hashtag #FireGinaCarano trended online after her post, putting pressure onto Disney to drop the 38-year-old actress from the series." style={swipeStyles[2]} image={image_3} counter="3/10" />
        <Card category="Entertainment" title="K-pop for the planet: Fans of South Korean stars take up climate activism" summary="      JAKARTA — From petitioning to save forests to raising cash for disaster victims, a growing army of K-pop fans worldwide has emerged as the latest force in the global fight against climate change." style={swipeStyles[1]} image={image_2} counter="2/10"/>
        <Card category="TheBigRead" title="The Big Read: Goodbye T-score, goodbye PSLE stress? Not so fast, as anxious parents size up new scoring system" summary="The PSLE T-score system, which has been around for six decades, will be scrapped after this year. The impending change has garnered mixed reactions, with some parents saying it reduces unhealthy competition, while others are concerned it may add to the stre." style={swipeStyles[0]} view={false} image={image_1} counter="1/10"/> */}
            </animated.div>
            <div className="overlay-buttons">
              {/* <div className="button"></div> */}
              <div className="read_more-button" onClick={() => {
                // TODO: Add actual swipe up gesture
                document.getElementsByClassName("swipeup_container")[0].classList.add("swiped_up");
              }}
              >
                <img src={arrow_up}></img>
          Read More
        </div>
              {/* <div className="button like_button"><img src={image_liked}></img></div> */}
            </div>
            <img src={close_button}
              className="close_overlay"
              onClick={() => {
                document.getElementsByClassName("article_overlay")[0].classList.remove("fadein");
                document.getElementsByTagName("body")[0].classList.remove("scroll-lock");
                setTimeout(function () {
                  document.getElementsByClassName("article_overlay")[0].style.display = "none";
                }, 500); // this aligns with the length of the opacity transition on article_overlay css class

                // Pause logic: similar logic as useEffect when index changes
                var new_timings = { ...viewTimings };
                let new_time = ((new Date).getTime() - timer) / 1000;
                if (position > numTutorialCards) {
                  if (new_timings[viewArticles[position - numTutorialCards]["news_id"]] == undefined) {
                    new_timings[viewArticles[position - numTutorialCards]["news_id"]] = new_time;
                  } else {
                    new_timings[viewArticles[position - numTutorialCards]["news_id"]] += new_time;
                  }
                  setViewTimings(new_timings);
                  if (new_time > READ_TIME_THRESHOLD) {
                    // Mark as read
                    fetch(`${domain}readers/`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        user_id: userId,
                        has_read: viewArticles[prevPosition - numTutorialCards]["news_id"],
                      }),
                    }).catch(console.log("failed to mark as read"))
                  }
                  console.log(`news_id/position_index: ${viewArticles[position - numTutorialCards]["news_id"]}/${position - numTutorialCards}`, `seconds_spent: ${new_timings[viewArticles[position - numTutorialCards]["news_id"]]}`);
                }
              }}
            />

          </div>
          <SwipeArticle html_render={"hello world"} />
        </div>
      </div>
    </div>
  );
}

// TODO: Handle restart logic

export default ArticleOverlay;
