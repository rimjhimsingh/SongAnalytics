/*
  Application Entry Point
  -----------------------
  This file acts as the "Bootstrapper" for the React application.
  It is responsible for bridging the gap between the raw HTML DOM (in index.html) 
  and the React Virtual DOM.
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
