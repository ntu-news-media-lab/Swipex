import today_screenshot from './res/homepage.png';
import './WebArticle.css';

function WebArticle() {
  return (
    <div className="web_article">
    <img src={today_screenshot} />
    <button onClick={() => document.getElementsByClassName("test")} />
    </div>
    
  );
}

export default WebArticle;
