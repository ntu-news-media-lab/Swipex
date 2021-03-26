import "./SwipeArticle.css";
import arrow_down from "./res/arrow_down.png"
// import { useEffect, useState } from "react";
// import { useSpring, animated } from "react-spring";
// import { useDrag } from "react-use-gesture";

function SwipeArticle(props) {

  return (
    <div className="article_view">
      <div className="overlay-buttons">
        <div className="read_less-button" onClick={() => {
            document.getElementsByClassName("swipedown_container")[0].classList.add("swiped_down");
          }}
        >
          <img src={arrow_down}></img>
          Swipe to Go Back
        </div>
      </div>
      
      <div className="article_title">{props.html_render}</div>
      <div className="article_content">{props.html_render}</div>
    </div>
  );
}

export default SwipeArticle;
