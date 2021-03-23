import "./SwipeArticle.css";
// import { useEffect, useState } from "react";
// import { useSpring, animated } from "react-spring";
// import { useDrag } from "react-use-gesture";

function SwipeArticle(props) {

  return (
    <div className="article_view">
      <div className="article_title">{props.html_render}</div>
      <div className="article_content">{props.html_render}</div>
    </div>
  );
}

export default SwipeArticle;
