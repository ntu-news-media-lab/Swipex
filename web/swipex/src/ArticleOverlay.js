import "./ArticleOverlay.css";
import today_screenshot from "./res/homepage_proper.png";
import "./WebArticle.css";
import swipeX from "./res/SwipeXbubble.png";
import Card from "./Card.js";
import FullArticle from "./FullArticle.js";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import {
  useWindowDimensions,
  capitalize,
  usePrevious,
  uuidv4,
  getRandomIntInclusive,
  mergeUserPreferences,
} from "./helpers";
import arrow_up from "./res/arrow_up.svg";
import close_button from "./res/close_button.png";
import tutorial_1 from "./res/tutorial_1.svg";
import tutorial_2 from "./res/tutorial_2.svg";
import tutorial_3 from "./res/tutorial_3.svg";
import ending_1 from "./res/ending_1.svg";
import CardFullImage from "./CardFullImage.js";
 
function ArticleOverlay() {
  const domain = "http://swipex.pythonanywhere.com/";
  const NUM_MAX_ARTICLE_CARDS = 10; // max total no. of swipeable article cards
  const REC_THRESHOLD = 5; // calculate preferences for new users when at least 5 cards are viewed and timings noted
  const NUM_INITIAL_ARTICLES = 2; // number of new articles for returning users before recommendations are shown
  const tutorial_render = [tutorial_1, tutorial_2, tutorial_3];
  const NUM_TUTORIAL_RENDER = tutorial_render.length;
  const CATEGORIES = ["World", "Voices", "The Big Read", "Tech", "Singapore", "Politics", "Health", "Gen Y Speaks", "Environment", "Entertainment", "Crime & Accident", "Brand Spotlight"];
  const NUM_CATEGORIES = CATEGORIES.length;
  const READ_TIME_THRESHOLD = 12;
  const MAX_SENSITIVITY_BUFFER = 4;
  const MIN_CATEGORY_PERCENT = Math.round(100 / NUM_CATEGORIES / 3);
 
  const WINDOW_SIZE = useWindowDimensions();
  const DRAG_LEFT_THRESHOLD = WINDOW_SIZE.width / 4.5;
  const DRAG_RIGHT_THRESHOLD = WINDOW_SIZE.width / 4;
  const SWIPED_CARDS_OFFSET = WINDOW_SIZE.width + 16;
  const OPACITY_OFFSET = 0.4;
  const MAGIC_MULTIPLIER_VERTICAL = 65;
  const MAGIC_MULTIPLIER_ROTATE = 9;
  const OPACITY_TRANSITION = 0.6;
  const TRANSFORM_TRANSITION = 0.3;
 
  const [userId, setUserId] = useState(undefined);
  // const [curUserPrefs, setCurUserPrefs] = useState(undefined);
  const [position, setPosition] = useState(0);
  var prevPosition = usePrevious(position);
  const [articleViewStyles, setArticleViewStyles] = useState({ transform: `translate3d(0, 0vh, 0)` });
  const [swipeStyles, setSwipeStyles] = useState(Array(NUM_MAX_ARTICLE_CARDS).fill({ opacity: 0 }, 1));
  const [viewTimings, setViewTimings] = useState({}); //Array(NUM_CARDS).fill({ news_id: undefined, seconds_spent: 0 })
  const [timer, setTimer] = useState(0);
  const [allArticles, setAllArticles] = useState(undefined);
  const [viewArticles, setViewArticles] = useState(undefined);
  const [numTutorialCards, setNumTutorialCards] = useState(0);
  const [numMaxArticleCards, setNumMaxArticleCards] = useState(0);
  const [fullArticleContent, setFullArticleContent] = useState(0);
 
  useEffect(() => {
    let user_id;
    let hist_user_prefs;
    let cur_user_prefs;
    let new_all_articles;
    let random_num;
    let new_view_articles = [];
    let is_new_user = false;
    let has_user_prefs = true;
 
    if (window.localStorage) {
      // retrieve user_id if exists, else create a new one and setState
      user_id = window.localStorage.getItem("user_id");
      if (user_id === null) {
        is_new_user = true;
        setNumTutorialCards(NUM_TUTORIAL_RENDER);
        user_id = uuidv4();
        window.localStorage.setItem("user_id", user_id);
        console.log("creating new user_id...");
      }
      setUserId(user_id);
      // check if historical user preferences and current user preferences exist, and merge them and save as hist_user_prefs
      hist_user_prefs = window.localStorage.getItem("hist_user_prefs");
      cur_user_prefs = window.localStorage.getItem("cur_user_prefs");
      console.log("ERROR");
      console.log(hist_user_prefs);
      console.log(cur_user_prefs);
      if (hist_user_prefs !== null && cur_user_prefs !== null) {
        console.log("regular user");
        window.localStorage.setItem(
          "hist_user_prefs",
          JSON.stringify(
            mergeUserPreferences(JSON.parse(hist_user_prefs), JSON.parse(cur_user_prefs), MAX_SENSITIVITY_BUFFER)
          )
        );
        window.localStorage.removeItem("cur_user_prefs");
      } else if (cur_user_prefs !== null) {
        // only cur_user_prefs may exist (users who use for the 2nd time), so save it as hist_user_prefs
        window.localStorage.setItem("hist_user_prefs", cur_user_prefs);
        console.log("2nd time user");
        console.log(cur_user_prefs);
      } else {
        console.log("incomplete returning user");
        has_user_prefs = false;
      }
    } else {
      alert(
        "Sorry! Your browser does not support the use of local storage! We recommend using either Chrome or Safari!"
      );
    }
    console.log(`user_id:`, user_id);
    console.log(`user_prefs:`, window.localStorage.getItem("hist_user_prefs"));
 
    // get articles that user has not read yet, process them and setState
    fetch(`${domain}news/?user_id=${user_id}`)
      .then((results) => results.json())
      .then((data) => {
        console.log("Success: /news", data);
        new_all_articles = data.reduce(function (map, obj) {
          map[obj.news_id] = {
            content: obj.content,
            headline: obj.headline,
            image: obj.image,
            category: obj.category,
            title: obj.title,
          };
          return map;
        }, {});
        setAllArticles(new_all_articles);
        console.log(new_all_articles);
        // randomly select (REC_THRESHOLD + 1) numbers to index the array of unread articles and setState
        let index = 0;
        let num_initial_articles;
        if (!has_user_prefs && data.length > REC_THRESHOLD + 1) {
          // if user has no preferences and data allows it, show the rec_threshold+1 num of articles
          num_initial_articles = REC_THRESHOLD + 1;
        } else if (data.length > NUM_INITIAL_ARTICLES) {
          num_initial_articles = NUM_INITIAL_ARTICLES;
        } else {
          num_initial_articles = data.length;
        }
        while (index < num_initial_articles) {
          random_num = getRandomIntInclusive(0, data.length - 1);
          if (new_view_articles.includes(random_num)) {
            continue;
          }
          new_view_articles.push(random_num);
          index++;
          console.log("stuck");
        }
        console.log("debug", new_view_articles.length);
        setViewArticles(
          new_view_articles.map((object, i) => ({
            content: data[object].content,
            headline: data[object].headline,
            image: data[object].image,
            news_id: data[object].news_id,
            category: data[object].category,
            title: data[object].title,
          }))
        );
        setNumMaxArticleCards(data.length > NUM_MAX_ARTICLE_CARDS ? NUM_MAX_ARTICLE_CARDS : data.length);
        setSwipeStyles(
          Array(
            (NUM_MAX_ARTICLE_CARDS > data.length ? NUM_MAX_ARTICLE_CARDS : data.length) +
              (is_new_user ? NUM_TUTORIAL_RENDER : 0) +
              1
          ).fill({ opacity: 0 }, 1) // + 1 to length of swipestyles to account for ending thank you card
        );
      });
  }, []);
 
  // this runs whenever a card is swiped (ie. position state is changed)
  // it actually runs once when the page is loaded, but its too early (even before the state for numMaxArticleCards is set)
  useEffect(() => {
    // if card is an article
    if (position >= numTutorialCards && position != numTutorialCards + numMaxArticleCards) {
      // set content for read more
      let new_full_article_content = {
        title: viewArticles[position - numTutorialCards]["title"],
        content: viewArticles[position - numTutorialCards]["content"],
        image: viewArticles[position - numTutorialCards]["image"],
      };
      setFullArticleContent(new_full_article_content);
 
      // make read more button visible
      document.getElementsByClassName("overlay-buttons")[0].style.display = "flex";
      setTimeout(function () {
        document.getElementsByClassName("overlay-buttons")[0].classList.add("fadein");
      }, 10);
    } else {
      // set read more button to display none
      document.getElementsByClassName("overlay-buttons")[0].classList.remove("fadein");
      setTimeout(function () {
        document.getElementsByClassName("overlay-buttons")[0].style.display = "none";
      }, 300); // corresponds to length of opacity transition on .overlay-buttons
    }
 
    if (prevPosition !== undefined) {
      // End the timer state to get time spent, and get news_id of the card that was last swiped
      var new_timings = { ...viewTimings };
      let new_time = (Date.now() - timer) / 1000;
      new_time = new_time > 0 ? new_time : 0;
      // update the new_timings object and setState if the card that was last swiped is not a tutorial card, and is also not the ending card
      if (prevPosition >= numTutorialCards && prevPosition != numTutorialCards + numMaxArticleCards) {
        let pre_news_id = viewArticles[prevPosition - numTutorialCards]["news_id"];
        if (new_timings[pre_news_id] === undefined) {
          new_timings[pre_news_id] = new_time;
        } else {
          new_timings[pre_news_id] += new_time;
        }
        setViewTimings(new_timings);
        // mark as read if time spent is more than READ_TIME_THRESHOLD
        if (new_time > READ_TIME_THRESHOLD) {
          fetch(`${domain}readers/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              has_read: pre_news_id,
            }),
          }).catch(console.log("failed to mark as read"));
        }
        // Begin a new timer state
        setTimer(Date.now());
        console.log(
          `news_id/position_index: ${pre_news_id}/${prevPosition - numTutorialCards}`,
          `seconds_spent: ${new_timings[pre_news_id]}`
        );
      } else if (position == numTutorialCards) {
        // if: the card that was last swiped is a tutorial card, else if: start timer only when the current position is a not tutorial card
        setTimer(Date.now());
      }
 
      let cur_user_prefs;
      let hist_user_prefs = window.localStorage.getItem("hist_user_prefs");
      // initialize and update a new set of CURRENT user preferences if the user has historical user preferences,
      // or if no. of timings collected meet REC_THRESHOLD
      if (hist_user_prefs !== null || Object.keys(new_timings).length >= REC_THRESHOLD) {
        console.log("initialise new cur_user_prefs");
        cur_user_prefs = CATEGORIES.reduce(function (map, category) {
          map[category] = { score: 0, num_cards: 0, sensitivity_buffer: 0 };
          return map;
        }, {});
        console.log(cur_user_prefs);
        for (let news_id in new_timings) {
          let category = allArticles[news_id]["category"];
          cur_user_prefs[category]["score"] += new_timings[news_id] ** (1 / 2); // the more time you spent reading, the less important that additional time spent is
          cur_user_prefs[category]["num_cards"] += 1; // the total number of cards (including duplicate cards that were just browsed but on separate occasions)
          cur_user_prefs[category]["sensitivity_buffer"] += 1; // each card contributes 1 to the sensitivity buffer
        }
        console.log(cur_user_prefs);
        for (let category in cur_user_prefs) {
          if (cur_user_prefs[category]["num_cards"] > 0) {
            cur_user_prefs[category]["score"] =
              cur_user_prefs[category]["score"] / cur_user_prefs[category]["num_cards"]; // weigh score by the number of each category that appear
          }
        }
        console.log(cur_user_prefs);
        window.localStorage.setItem("cur_user_prefs", JSON.stringify(cur_user_prefs));
      }
 
      // add more articles to be displayed, if user's current position is the last article currently being displayed AND also not the last card
      if (
        position - numTutorialCards == viewArticles.length - 1 &&
        position - numTutorialCards < numMaxArticleCards - 1
      ) {
        console.log(position - numTutorialCards, viewArticles.length - 1);
        console.log(
          position - numTutorialCards == viewArticles.length - 1,
          position - numTutorialCards < numMaxArticleCards - 1
        );
        let merged_user_prefs;
        // console.log(hist_user_prefs);
        // if returning user, merge new_user_prefs with old_user_prefs, then select new article
        console.log("ERROR");
        console.log(hist_user_prefs);
        if (hist_user_prefs !== null) {
          console.log("merging");
          merged_user_prefs = mergeUserPreferences(JSON.parse(hist_user_prefs), cur_user_prefs, MAX_SENSITIVITY_BUFFER);
        } else {
          console.log("using current preferences");
          merged_user_prefs = cur_user_prefs;
        }
        console.log(merged_user_prefs);
        // Final processing before selecting
        let total = Object.values(merged_user_prefs).reduce((t, value) => t + value["score"], 0);
        // scores to sum to 100 for better interpretation, with minimum score of MIN_CATEGORY_PERCENT, and calculate amount to be redistributed
        let redistribution = 0;
        for (let category in merged_user_prefs) {
          let raw_score = Math.round((merged_user_prefs[category]["score"] / total) * 100);
          redistribution += raw_score < MIN_CATEGORY_PERCENT ? MIN_CATEGORY_PERCENT - raw_score : 0;
          merged_user_prefs[category]["score"] = raw_score < MIN_CATEGORY_PERCENT ? MIN_CATEGORY_PERCENT : raw_score;
          merged_user_prefs[category]["above_threshold"] = raw_score < MIN_CATEGORY_PERCENT ? 0 : 1;
        }
        let num_sharing = Object.values(merged_user_prefs).reduce((t, value) => t + value["above_threshold"], 0);
        for (let category in merged_user_prefs) {
          merged_user_prefs[category]["score"] -= merged_user_prefs[category]["above_threshold"]
            ? Math.round(redistribution / num_sharing)
            : 0;
        }
 
        // Selection process
        total = Object.values(merged_user_prefs).reduce((t, value) => t + value["score"], 0); // since after redistribution and rounding, total may not be 100
        console.log(total);
        // creating a weighted array
        let weighted_category_array = Array(total);
        let starting_fill = 0;
        for (let index = 0; index < CATEGORIES.length; index++) {
          let category = CATEGORIES[index];
          weighted_category_array.fill(category, starting_fill);
          starting_fill += merged_user_prefs[category]["score"];
        }
        // choosing a category (string) and then an article (news_id): it must not be those have been already displayed
        let unavailable_categories = [];
        let chosen_article;
        let chosen_category = weighted_category_array[getRandomIntInclusive(0, total - 1)];
        let found_article;
        while (true) {
          found_article = false;
          if (unavailable_categories.length == CATEGORIES.length) {
            break;
          }
          while (unavailable_categories.includes(chosen_category)) {
            chosen_category = weighted_category_array[getRandomIntInclusive(0, total - 1)];
            console.log("stuck1");
          }
          let chosen_articles = [];
          for (const [key, value] of Object.entries(allArticles)) {
            if (value["category"] == chosen_category) {
              chosen_articles.push(key);
            }
          }
          while (true) {
            if (!chosen_articles.length) {
              console.log("stuck2");
              break;
            }
            chosen_article = chosen_articles[getRandomIntInclusive(0, chosen_articles.length - 1)];
            if (!viewArticles.some((article) => article["news_id"] == chosen_article)) {
              // if not in viewArticles
              console.log(viewArticles, chosen_article);
              let new_viewarticles = viewArticles.slice(0);
              new_viewarticles.push({
                content: allArticles[chosen_article].content,
                headline: allArticles[chosen_article].headline,
                image: allArticles[chosen_article].image,
                news_id: chosen_article,
                category: allArticles[chosen_article].category,
                title: allArticles[chosen_article].title,
              });
              setViewArticles(new_viewarticles);
              found_article = true;
              break;
            }
            chosen_articles.splice(chosen_articles.indexOf(chosen_article), 1);
          }
 
          if (found_article) {
            break;
          }
 
          unavailable_categories.push(chosen_category);
          console.log("stuck3");
        }
      }
    }
  }, [position]);
 
  const [{ x }, set] = useSpring(() => ({
    x: 0,
  }));
  const bind = useDrag(
    ({ down, movement }) => {
      console.log(down, movement); // whether finger is down on the screen, swipe right and below is positive (x,y) movement
      const newSwipeStyles = swipeStyles.slice();
      // var new_move = movement[0];
 
      if (down) {
        if (movement[0] <= -2 && position < numMaxArticleCards + numTutorialCards - 1 + 1) {
          // + 1 to account for ending thank you card
          set({ x: movement[0] });
          newSwipeStyles[position] = {
            transform: x.interpolate(
              (x) =>
                `translate3d(${x}px, ${
                  -MAGIC_MULTIPLIER_VERTICAL * (movement[0] / SWIPED_CARDS_OFFSET) ** 2
                }px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE * (movement[0] / SWIPED_CARDS_OFFSET) ** 2}deg)`
            ),
            opacity: 1 - -movement[0] / SWIPED_CARDS_OFFSET + OPACITY_OFFSET,
            zIndex: 1,
          };
          newSwipeStyles[position + 1] = { opacity: -movement[0] / SWIPED_CARDS_OFFSET };
          setSwipeStyles(newSwipeStyles);
        } else if (position > 0 && movement[0] >= 2) {
          // update movement of previous card to the right
          newSwipeStyles[position] = {
            transform: `translate3d(0px, 0px, 0px)`,
            opacity: 1 - movement[0] / SWIPED_CARDS_OFFSET,
          };
          // set({ x: -SWIPED_CARDS_OFFSET + movement[0] });
          newSwipeStyles[position - 1] = {
            transform: `translate3d(${-SWIPED_CARDS_OFFSET + movement[0]}px, ${
              -MAGIC_MULTIPLIER_VERTICAL * (1 - movement[0] / SWIPED_CARDS_OFFSET) ** 2
            }px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE * (1 - movement[0] / SWIPED_CARDS_OFFSET) ** 2}deg)`,
            opacity: movement[0] / SWIPED_CARDS_OFFSET + OPACITY_OFFSET,
            zIndex: 1,
          };
          setSwipeStyles(newSwipeStyles);
        }
      } else if (movement[0] < -DRAG_LEFT_THRESHOLD && position < numMaxArticleCards + numTutorialCards - 1 + 1) {
        // drag to the left
        set({ x: 0 });
        newSwipeStyles[position] = {
          transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, ${-MAGIC_MULTIPLIER_VERTICAL}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE}deg)`,
          opacity: OPACITY_OFFSET,
          transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`,
          zIndex: 0,
        };
        if (position < numMaxArticleCards + numTutorialCards - 1 + 1) {
          newSwipeStyles[position + 1] = {
            opacity: 1,
            transition: `opacity ${OPACITY_TRANSITION}s ease-out`,
            zIndex: 1,
          };
        }
        setSwipeStyles(newSwipeStyles);
        setPosition(position + 1);
      } else if (movement[0] > DRAG_RIGHT_THRESHOLD && position > 0) {
        // drag to the right
        set({ x: 0 });
        newSwipeStyles[position - 1] = {
          transform: `translate3d(0px, 0px, 0px) rotate3d(0, 0, 1, 0deg)`,
          opacity: 1,
          transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`,
          zIndex: 1,
        };
        newSwipeStyles[position] = { opacity: 0, transition: `opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 0 };
        setSwipeStyles(newSwipeStyles);
        setPosition(position - 1);
      } else if (movement[0] >= 2 && position > 0) {
        // never drag right enough
        set({ x: 0 });
        newSwipeStyles[position - 1] = {
          transform: `translate3d(${-SWIPED_CARDS_OFFSET}px, ${-MAGIC_MULTIPLIER_VERTICAL}px, 0px) rotate3d(0, 0, 1, ${MAGIC_MULTIPLIER_ROTATE}deg)`,
          opacity: OPACITY_OFFSET,
          transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`,
          zIndex: 0,
        };
        newSwipeStyles[position] = { opacity: 1, transition: `opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 1 };
        setSwipeStyles(newSwipeStyles);
      } else if (movement[0] <= -2 && position < numMaxArticleCards + numTutorialCards - 1 + 1) {
        // never drag left enough
        set({ x: 0 });
        newSwipeStyles[position] = {
          transform: `translate3d(0px, 0px, 0px) rotate3d(0, 0, 1, 0deg)`,
          transition: `transform ${TRANSFORM_TRANSITION}s, opacity ${OPACITY_TRANSITION}s ease-out`,
          zIndex: 1,
        };
        newSwipeStyles[position + 1] = { opacity: 0, transition: `opacity ${OPACITY_TRANSITION}s ease-out`, zIndex: 0 };
        setSwipeStyles(newSwipeStyles);
      }
    },
    {
      bounds: { left: -SWIPED_CARDS_OFFSET, right: SWIPED_CARDS_OFFSET, top: 0, bottom: 0 },
    }
  );
 
  const [{ y }, sety] = useSpring(() => ({
    y: 0,
  }));
  const bindswipeup = useDrag(
    ({ down, movement, swipe }) => {
      // position will either be -1, 0 or 1
      // set({ y: swipe[1] })
      console.log(movement, swipe, down);
    },
    { swipeDistance : 5 }
  );
 
  return (
    <div>
      <div className="web_article">
        <img src={today_screenshot} className="img_today_screenshot" alt="landing page of TODAYonline" />
        <img
          src={swipeX}
          className="explore_btn"
          alt="Open SwipeX"
          onClick={() => {
            document.getElementsByClassName("article_overlay")[0].style.display = "block";
            setTimeout(function () {
              document.getElementsByClassName("article_overlay")[0].classList.add("fadein");
              document.getElementsByTagName("body")[0].classList.add("scroll-lock");
            }, 10);
            if (position >= numTutorialCards && position != numTutorialCards + numMaxArticleCards) {
              setTimer(Date.now() + 500);
              let new_full_article_content = {
                title: viewArticles[position - numTutorialCards]["title"],
                content: viewArticles[position - numTutorialCards]["content"],
                image: viewArticles[position - numTutorialCards]["image"],
              };
              setFullArticleContent(new_full_article_content);
 
              document.getElementsByClassName("overlay-buttons")[0].style.display = "flex";
              setTimeout(function () {
                document.getElementsByClassName("overlay-buttons")[0].classList.add("fadein");
              }, 10);
            }
          }}
        />
      </div>
 
      <div className="article_overlay">
        <animated.div className="swipeup_container">
          <div className="card_view">
            <div className="overlay-cards_container" {...bind()}>
              {numTutorialCards
                ? tutorial_render.map((object, i) => (
                    <CardFullImage imagesrc={object} style={swipeStyles[i]} key={`tut_${i}`} />
                  ))
                : ""}
              {viewArticles
                ? viewArticles.map((object, i) => (
                    <Card
                      category={capitalize(object.category)}
                      title={object.title}
                      summary={object.headline}
                      style={swipeStyles[i + numTutorialCards]}
                      image={object.image}
                      counter={`${i + 1}/${numMaxArticleCards}`}
                      key={object.news_id}
                    />
                  ))
                : console.log("loading")}
              <CardFullImage
                imagesrc={ending_1}
                style={swipeStyles[numTutorialCards + numMaxArticleCards]}
                key={`ending`}
              />
            </div>
            <div className="overlay-buttons" {...bindswipeup()}>
              <div
                className="read_more-button"
                // onClick={() => {
                //   // TODO: Add actual swipe up gesture
                //   document.getElementsByClassName("swipeup_container")[0].classList.add("swiped_up");
                // }}
              >
                <img src={arrow_up} alt=""></img>
                Read More
              </div>
            </div>
            <img
              src={close_button}
              className="close_overlay"
              alt="Close SwipeX"
              onClick={() => {
                document.getElementsByClassName("article_overlay")[0].classList.remove("fadein");
                document.getElementsByTagName("body")[0].classList.remove("scroll-lock");
                setTimeout(function () {
                  document.getElementsByClassName("article_overlay")[0].style.display = "none";
                }, 500); // this aligns with the length of the opacity transition on article_overlay css class
 
                // Pause logic: similar logic as useEffect when index changes
                var new_timings = { ...viewTimings };
                let new_time = (Date.now() - timer) / 1000;
                new_time = new_time > 0 ? new_time : 0;
                if (prevPosition >= numTutorialCards && prevPosition != numTutorialCards + numMaxArticleCards) {
                  let pre_news_id = viewArticles[prevPosition - numTutorialCards]["news_id"];
                  if (new_timings[pre_news_id] === undefined) {
                    new_timings[pre_news_id] = new_time;
                  } else {
                    new_timings[pre_news_id] += new_time;
                  }
                  setViewTimings(new_timings);
                  // Mark as read
                  if (new_time > READ_TIME_THRESHOLD) {
                    fetch(`${domain}readers/`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: userId,
                        has_read: pre_news_id,
                      }),
                    }).catch(console.log("failed to mark as read"));
                  }
                  console.log(
                    `news_id/position_index: ${viewArticles[position - numTutorialCards]["news_id"]}/${
                      position - numTutorialCards
                    }`,
                    `seconds_spent: ${new_timings[viewArticles[position - numTutorialCards]["news_id"]]}`
                  );
                }
              }}
            />
          </div>
          {/* <FullArticle html_render={"hello world"} /> */}
          <FullArticle
            title={fullArticleContent["title"]}
            content={fullArticleContent["content"]}
            image={fullArticleContent["image"]}
          />
        </animated.div>
      </div>
    </div>
  );
}
 
export default ArticleOverlay;
 