import React, { Fragment } from "react";
import RoundStatus from "../../../../model/roundStatus";
import Card from "../card";
import MoneyArea from "../../../ui/moneyArea";
import Player from "../../../../model/player/player";

type FinishedSplitHandsProps = {
    player: Player;
    roundStatus: RoundStatus;
}

function FinishedSplitHands({ player, roundStatus }: FinishedSplitHandsProps): JSX.Element {
  return (
    <>
      {player.finishedSplitHands.map(({ cards: finishedSplitCards, bet }, idxHands) => (
        <Fragment key={finishedSplitCards.map((card) => card.id.toString()).reduce((id, ids) => id + ids, "")}>
          {/* if round has ended, don't render last hand as a finished split hand, but render it as a current hand */}
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

export default FinishedSplitHands;
