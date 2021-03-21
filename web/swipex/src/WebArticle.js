import today_screenshot from "./res/homepage_proper.png";
import "./WebArticle.css";

function WebArticle() {
  return (
    <div className="web_article">
      <img src={today_screenshot} className="img_today_screenshot"/>
      <div
        className="explore_btn"
        onClick={() => {
          document.getElementsByClassName("article_overlay")[0].style.display = "block";
          setTimeout(function () {
            document.getElementsByClassName("article_overlay")[0].classList.add("fadein");
            document.getElementsByTagName("body")[0].classList.add("scroll-lock");
          }, 10);
        }}
      >
        Explore
      </div>
    </div>
  );
}

export default WebArticle;
