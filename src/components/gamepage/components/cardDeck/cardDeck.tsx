import React from "react";
import Card from "../card";
import CardModel from "../../../../model/card/card";
import Player from "../../../../model/player/player";
import RoundStatus from "../../../../model/roundStatus";
import SplitHands from "./splitHands";
import FinishedSplitHands from "./finishedSplitHands";

type CardDeckProps = {
    player: Player;
    roundStatus: RoundStatus;
}

function CardDeck({ player, roundStatus }: CardDeckProps): JSX.Element {
  const { cards } = player.hand;

  return (
    <>
      <SplitHands player={player} />
      <div className="card-deck">
        {cards.map((card: CardModel) => (
          <Card
            card={card}
            key={card.id}
          />
        ))}
        <div className="card-deck-points">
          {player.cardPoints}
        </div>
      </div>
      <FinishedSplitHands player={player} roundStatus={roundStatus} />
    </>
  );
}

export default CardDeck;
