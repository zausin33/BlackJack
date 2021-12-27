import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./components/parts/header";

function App(): JSX.Element {
  return (
    <div className="App">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
