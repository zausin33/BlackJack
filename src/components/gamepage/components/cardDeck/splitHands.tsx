import React from "react";
import Card from "../card";
import MoneyArea from "../../../ui/moneyArea";
import Player from "../../../../model/player/player";

type SplitHandsProps = {
    player: Player;
}

function SplitHands({ player }: SplitHandsProps): JSX.Element {
  return (
    <>
      {player.splitHands.map(({ cards: [card], bet }) => (
        <div className="split-hand-card-deck" key={card.id}>
          <Card card={card} isNotFromStack />
          <MoneyArea money={bet} className="card-deck-bet" doRenderWithDelay />
        </div>
      ))}
    </>
  );
}

export default SplitHands;
