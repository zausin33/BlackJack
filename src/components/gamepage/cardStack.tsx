import React from "react";
import { imageFolder } from "./card";

function CardStack(): JSX.Element {
  const n = 10;
  const array = Array(n).fill(null).map((_, i) => i);
  return (
    <div className="card-stack">
      {array.map((e) => (
        <img
          src={`${imageFolder}concealed.png`}
          alt="CardStack"
          className="card-stack-image"
          key={e}
          id={e === 9 ? "first-stack-img" : ""}
        />
      ))}
    </div>
  );
}

export default CardStack;
