import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import WebArticle from "./WebArticle";
import ArticleOverlay from "./ArticleOverlay";
import ArticleOverlay_alt from "./ArticleOverlay_alternative_test";
import reportWebVitals from "./reportWebVitals";

import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

ReactDOM.render(
  <React.StrictMode>
    <WebArticle />
    <ArticleOverlay />
    {/* <Toggle /> */}
    {/* <Example /> */}
  </React.StrictMode>,
  document.getElementById("root")
);

function Toggle() {
  const [toggled, setToggled] = useState(false);

  const backgroundStyle = {
    backgroundColor: "#ddd",
    cursor: "pointer",
    height: 50,
    width: 100,
  };

  const [{ x }, set] = useSpring(() => ({
    x: 0,
  }));

  const knobStyle = {
    transform: x.interpolate((x) => `translate3d(${x}px, 0px, 0)`),
    backgroundColor: "#444",
    height: 50,
    width: 50,
  };

  const RANGE = 50;
  const bind = useDrag(({ down, tap }) => {
    if (!down && tap) {
      set({ x: toggled ? 0 : RANGE });
      setToggled(!toggled);
      return;
    }

    if (down) {
      set({ x });
    } else {
      const isToggled = x > -RANGE / 2;
      set({ x: isToggled ? 0 : -RANGE });
      setToggled(isToggled);
    }
  });

  return (
    <div // Background
      style={backgroundStyle}
    >
      <animated.div // Knob
        style={knobStyle}
        {...bind()}
      ></animated.div>
    </div>
  );
}

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
