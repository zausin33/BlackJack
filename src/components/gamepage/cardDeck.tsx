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
        // eslint-disable-next-line react/no-array-index-key
        <div className="split-hand-card-deck" key={`${idx}_${card.getImageName()}`}>
          <Card card={card} />
          <div className="card-deck-bet">
            <Money amount={bet} />
          </div>
        </div>
      ))}
      <div className="card-deck">
        {/* eslint-disable-next-line react/no-array-index-key */}
        {cards.map((card: CardModel, idx) => (<Card card={card} key={`${idx}_${card.getImageName()}`} />))}
        <div className="card-deck-points">
          {player.getCardPoints()}
        </div>
      </div>
      {finishedSplitHands.map(({ cards: finishedSplitCards, bet }, idxHands) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={idxHands}>
          {(roundStatus !== RoundStatus.END_SPLIT_ROUND || idxHands !== 0) && (
            <div className="split-hand-card-deck">
              {/* eslint-disable-next-line react/no-array-index-key */}
              {finishedSplitCards.map((card, idx) => (<Card card={card} key={`${idxHands}_${idx}_${card.getImageName()}`} style={idx !== 0 ? { marginLeft: "-90px" } : {}} />))}

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
