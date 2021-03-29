import "./Card.css";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

function CardTutorial(props) {
  return (
    <animated.div className="card tutorial" style={props.style}>
      <div className="card-content tutorial" >
        <img src={props.tutorial} />
      </div>
    </animated.div>
  );
}

export default CardTutorial;
