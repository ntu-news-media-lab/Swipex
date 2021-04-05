import "./FullArticle.css";
import arrow_down from "./res/arrow_down.svg";

function split_paragraphs(text, num_full_stops) {
  let render_paragraphs = [];
  if (text !== undefined) {
    let sentence_list = text.split(".");
    let para_text = "";
    let sentence_counter = 0;
    let index = 0;
    for (; index < sentence_list.length; index++) {
      para_text += sentence_list[index];
      para_text += ".";
      sentence_counter++;
      if (sentence_counter === num_full_stops) {
        render_paragraphs.push(<p key={index}>{para_text}</p>);
        sentence_counter = 0;
        para_text = "";
      }
    }
    if (para_text !== "") {
      render_paragraphs.push(<p key={index}>{para_text}</p>);
    }
  }
  return render_paragraphs;
}

function FullArticle(props) {
  return (
    <div className="article_view" {...props.onSwipe()}>
      <div className="article_card">
        <div className="article_overlay-buttons">
          <div className="read_less-button" onClick={props.onClick}>
            <img src={arrow_down} alt=""/>
            Swipe to Return
          </div>
        </div>
        <div className="article_container">
          <div className="article_title">{props.title}</div>
          <div className="article_image_container">
            <img src={props.image} className="article_img" alt="" />
          </div>
          <div className="article_content">{split_paragraphs(props.content, 3)}</div>
        </div>
      </div>
    </div>
  );
}

export default FullArticle;
