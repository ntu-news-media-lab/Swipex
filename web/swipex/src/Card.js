import "./Card.css";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

// const DRAG_THRESHOLD = 150;
// const SWIPED_CARDS_OFFSET = 500;

function Card(props) {
  return (
    <animated.div className="card" style={props.style}>
      <div className="card-category">{props.category}</div>
      <div className="card-content">{props.content}</div>
    </animated.div>
  );
}

export default Card;
