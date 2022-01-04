import "bootstrap/dist/css/bootstrap.css";
import "./assets/css/base.css";
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./pages/errorpage/errorpage";
import Startpage from "./pages/startpage/startpage";
import GamePage from "./pages/gamepage/gamepage";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Startpage />} />
          <Route path="blackjack" element={<GamePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
