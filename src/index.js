// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
// 👇 use HashRouter instead of BrowserRouter
import { HashRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
