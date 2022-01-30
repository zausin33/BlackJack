import React, { Fragment } from "react";
import Card from "./card";
import CardModel from "../../model/card/Card";
import Player from "../../model/player/Player";
import RoundStatus from "../../model/RoundStatus";
import MoneyArea from "../ui/moneyArea";

type CardDeckProps = {
    player: Player;
    roundStatus: RoundStatus;
}

function CardDeck({ player, roundStatus }: CardDeckProps): JSX.Element {
  const { cards } = player.hand;

  return (
    <>
      {player.splitHands.map(({ cards: [card], bet }) => (
        <div className="split-hand-card-deck" key={card.id}>
          <Card card={card} isNotFromStack />
          <MoneyArea money={bet} className="card-deck-bet" doRenderWithDelay />
        </div>
      ))}
      <div className="card-deck">
        {cards.map((card: CardModel, idx) => (
          <Card
            card={card}
            key={card.id}
          />
        ))}
        <div className="card-deck-points">
          {player.cardPoints}
        </div>
      </div>
      {player.finishedSplitHands.map(({ cards: finishedSplitCards, bet }, idxHands) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={finishedSplitCards.map((card) => card.id.toString()).reduce((id, ids) => id + ids, "")}>
          {(roundStatus !== RoundStatus.END_SPLIT_ROUND || idxHands !== 0) && (
            <div className="split-hand-card-deck">
              {finishedSplitCards.map((card, idx) => (
                <Card
                  card={card}
                  key={card.id}
                  style={idx !== 0 ? { marginLeft: "-90px" } : {}}
                  isNotFromStack
                />
              ))}
              <MoneyArea money={bet} className="card-deck-bet" doRenderWithDelay />
            </div>
          )}
        </Fragment>
      ))}
    </>
  );
}

export default CardDeck;
