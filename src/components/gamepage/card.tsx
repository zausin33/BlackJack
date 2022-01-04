import React from "react";
import CardModel from "../../model/card/Card";

type CardProps = {
    card: CardModel;
    style?: object
}

function Card({ card, style = {}, ...props }: CardProps): JSX.Element {
  const imageFolder = "assets/images/cards/";

  return (
    <div className="game-card" style={style}>
      <img src={imageFolder + card.getImageName()} alt="Card" />
    </div>
  );
}

export default Card;
