import logo_today_solid from './res/logo_today_solid.png';
import './WebArticle.css';

function WebArticle() {
  return (
    <div className="web_article">
    <img src={logo_today_solid} />
    Screenshot of our Figma design, with an invisible button to open our tool
    <button onClick={() => document.getElementsByClassName("test")} />
    </div>
  );
}

export default WebArticle;
