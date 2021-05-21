import "./Card.css";
import { animated } from "react-spring";

function CardFullImage(props) {
  return (
    <animated.div className="card tutorial" style={props.style}>
      <div className="card-content tutorial">
        <img src={props.imagesrc} alt="To introduce the user to SwipeX and thank them for using the tool" />
        {props.nml_logo_style && <a href="http://www.newsmedialab.wkwsci.ntu.edu.sg/index.html"><div className="nml_text">Powered by:</div><img className="nml_logo" src={props.nml_logo_style} /></a> }
      </div>
    </animated.div>
  );
}

export default CardFullImage;
