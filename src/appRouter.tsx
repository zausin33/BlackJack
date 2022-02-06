import { Route, Routes } from "react-router-dom";
import React from "react";
import App from "./app";
import Startpage from "./pages/startpage/startpage";
import GamePage from "./pages/gamepage/gamepage";
import ErrorPage from "./pages/errorpage/errorpage";

export default function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Startpage />} />
        <Route path="blackjack" element={<GamePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
