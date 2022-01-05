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
  const cards: CardModel[] = player.getHand();
  const finishedSplitHands = player.getFinishedSplitHands();

  return (
    <>
      {player.getSplitHands().map(({ card, bet }, idx) => (
        <div className="split-hand-card-deck" key={card.getId()}>
          <Card card={card} isFromStack={false} playerName={player.getName()} />
          <div className="card-deck-bet">
            <Money amount={bet} />
          </div>
        </div>
      ))}
      <div className="card-deck" id={`card-deck-${player.getName()}`}>
        {cards.map((card: CardModel, idx) => (
          <Card
            card={card}
            key={card.getId()}
            playerName={player.getName()}
          />
        ))}
        <div className="card-deck-points">
          {player.getCardPoints()}
        </div>
      </div>
      {finishedSplitHands.map(({ cards: finishedSplitCards, bet }, idxHands) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={finishedSplitCards.map((card) => card.getId().toString()).reduce((id, ids) => id + ids, "")}>
          {(roundStatus !== RoundStatus.END_SPLIT_ROUND || idxHands !== 0) && (
            <div className="split-hand-card-deck">
              {finishedSplitCards.map((card, idx) => (
                <Card
                  card={card}
                  key={card.getId()}
                  style={idx !== 0 ? { marginLeft: "-90px" } : {}}
                  isFromStack={false}
                  playerName={player.getName()}
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
