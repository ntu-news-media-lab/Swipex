import today_screenshot from "./res/homepage_proper.png";
import "./WebArticle.css";
import swipeX from "./res/SwipeXbubble.png";

function WebArticle(props) {
  return (
    <div className="web_article">
      <img src={today_screenshot} className="img_today_screenshot" />
      <img src={swipeX}
        className="explore_btn"
        onClick={props.onClick}
      />
    </div>
  );
}

export default WebArticle;
