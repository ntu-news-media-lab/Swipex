import "./Card.css";
import { animated } from "react-spring";

function CardFullImage(props) {
  return (
    <animated.div className="card tutorial" style={props.style}>
      <div className="card-content tutorial" >
        <img src={props.imagesrc} alt="To introduce the user to SwipeX and thank them for using the tool"/>
      </div>
    </animated.div>
  );
}

export default CardFullImage;
