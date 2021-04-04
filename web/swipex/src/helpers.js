import { useState, useEffect, useRef } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function getRandomIntInclusive(min, max) {
  const randomBuffer = new Uint32Array(1);

  window.crypto.getRandomValues(randomBuffer);

  let randomNumber = randomBuffer[0] / (0xffffffff + 1);

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomNumber * (max - min + 1)) + min;
}

export function mergeUserPreferences(hist_user_prefs, cur_user_prefs, MAX_SENSITIVITY_BUFFER) {
  console.log(hist_user_prefs, cur_user_prefs, MAX_SENSITIVITY_BUFFER);
  for (let category in hist_user_prefs) {
    if (cur_user_prefs[category]["num_cards"]) {
      if (hist_user_prefs[category]["sensitivity_buffer"] < MAX_SENSITIVITY_BUFFER) {
        hist_user_prefs[category]["score"] =
          (hist_user_prefs[category]["score"] * hist_user_prefs[category]["num_cards"] +
            cur_user_prefs[category]["score"] * cur_user_prefs[category]["num_cards"]) /
          (cur_user_prefs[category]["num_cards"] + hist_user_prefs[category]["num_cards"]);
        hist_user_prefs[category]["sensitivity_buffer"] += 1;
      } else {
        hist_user_prefs[category]["score"] =
          (hist_user_prefs[category]["score"] * (MAX_SENSITIVITY_BUFFER - 1) + cur_user_prefs[category]["score"]) /
          MAX_SENSITIVITY_BUFFER;
      }
      hist_user_prefs[category]["num_cards"] += cur_user_prefs[category]["num_cards"];
    }
  }
  console.log(hist_user_prefs, cur_user_prefs, MAX_SENSITIVITY_BUFFER);
  return hist_user_prefs;
}

// function isObject(obj) {
//   var type = typeof obj;
//   return type === 'function' || type === 'object' && !!obj;
// };

// export function iterationCopy(src) {
//   let target = {};
//   for (let prop in src) {
//     if (src.hasOwnProperty(prop)) {
//       // if the value is a nested object, recursively copy all it's properties
//       if (isObject(src[prop])) {
//         target[prop] = iterationCopy(src[prop]);
//       } else {
//         target[prop] = src[prop];
//       }
//     }
//   }
//   return target;
// }