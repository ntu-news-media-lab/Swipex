import "./Card.css";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

function Card(props) {

  // const 

  return (
    <animated.div className="card" style={props.style}>
      <div className="card-category">{props.category}</div>
      <div className="card-content">
        <div className="card-image-container">
          <img src={props.image} className="main-img" />
          <img src={props.image} className="blur-img" />
        </div>
        <div className="card-title">{props.title}</div>
        <div className="card-summary">{props.summary}</div>
      </div>
    </animated.div>
  );
}

export default Card;
