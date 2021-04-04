import "./FullArticle.css";
import arrow_down from "./res/arrow_down.svg";

function FullArticle(props) {
  return (
    <div className="article_view">
      <div className="article_card">
        <div className="article_overlay-buttons">
          <div
            className="read_less-button"
            {...props.onSwipe()}
          >
            <img src={arrow_down} alt="" />
            Swipe to Return
          </div>
        </div>
        <div className="article_container">
          <div className="article_title">{props.title}</div>
          <div className="article_image_container">
            <img src={props.image} className="article_img" alt="" />
          </div>
          <div className="article_content">{props.content}</div>
        </div>
      </div>
    </div>
  );
}

export default FullArticle;
