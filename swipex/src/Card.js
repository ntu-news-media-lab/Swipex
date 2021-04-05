import "./Card.css";
import { animated } from "react-spring";

function Card(props) {
  
  return (
    <animated.div className="card" style={props.style}>
      <div className="card-category">{props.category}</div>
      <div className="card-content">
        <div className="card-image-container">
          <img src={props.image} className="main-img" alt="To accompany news article on Today"/>
          <img src={props.image} className="blur-img" alt=""/>
        </div>
        <div className="card-counter">{props.counter}</div>
        <div className="card-text">
          <div className="card-title">{props.title}</div>
          <div className="card-summary">{props.summary}</div>
        </div>
      </div>
    </animated.div>
  );
}

export default Card;
