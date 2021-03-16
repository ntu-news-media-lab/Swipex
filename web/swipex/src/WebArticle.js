import today_screenshot from './res/homepage.png';
import './WebArticle.css';

function WebArticle() {
  return (
    <div className="web_article">
    <img src={today_screenshot} />
    <button className="explore_btn" onClick={() => document.getElementsByClassName("article_overlay")[0].style.display="block"} >
      Explore
    </button>
    </div>
    
  );
}

export default WebArticle;
