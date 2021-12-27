import React from "react";
import { Link } from "react-router-dom";

function Startpage(): JSX.Element {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Startpage</h2>
      <Link to="/blackjack">start</Link>
    </main>
  );
}

export default Startpage;
