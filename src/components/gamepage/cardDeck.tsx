import React, { Fragment } from "react";
import Card from "./card";
import CardModel from "../../model/card/Card";
import Player from "../../model/player/Player";
import RoundStatus from "../../model/RoundStatus";
import Money from "../ui/money";

type CardDeckProps = {
    player: Player;
    roundStatus: RoundStatus;
}

function CardDeck({ player, roundStatus }: CardDeckProps): JSX.Element {
  const cards: CardModel[] = player.hand;
  const { finishedSplitHands } = player;

  return (
    <>
      {player.splitHands.map(({ card, bet }, idx) => (
        <div className="split-hand-card-deck" key={card.id}>
          <Card card={card} isFromStack={false} playerName={player.name} />
          <div className="card-deck-bet">
            <Money amount={bet} />
          </div>
        </div>
      ))}
      <div className="card-deck" id={`card-deck-${player.name}`}>
        {cards.map((card: CardModel, idx) => (
          <Card
            card={card}
            key={card.id}
            playerName={player.name}
          />
        ))}
        <div className="card-deck-points">
          {player.cardPoints}
        </div>
      </div>
      {finishedSplitHands.map(({ cards: finishedSplitCards, bet }, idxHands) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={finishedSplitCards.map((card) => card.id.toString()).reduce((id, ids) => id + ids, "")}>
          {(roundStatus !== RoundStatus.END_SPLIT_ROUND || idxHands !== 0) && (
            <div className="split-hand-card-deck">
              {finishedSplitCards.map((card, idx) => (
                <Card
                  card={card}
                  key={card.id}
                  style={idx !== 0 ? { marginLeft: "-90px" } : {}}
                  isFromStack={false}
                  playerName={player.name}
                />
              ))}
              <div className="card-deck-bet">
                <Money amount={bet} />
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </>
  );
}

export default CardDeck;
