import React from "react";
import CardCounterModel from "../../../../model/strategy/cardCounter";
import RoundStatus from "../../../../model/roundStatus";

type CardCounterProps = {
  cardCounter: CardCounterModel
  roundStatus: RoundStatus;
}

function CardCounter({ cardCounter, roundStatus }: CardCounterProps): JSX.Element {
  return (
    <div
      className="small-wrapper center box-shadow"
      style={roundStatus === RoundStatus.STARTING ? { zIndex: 2000, position: "absolute" } : {}}
    >
      <div>
        <h5 style={{ fontWeight: 600 }}>Karten Zähler</h5>
        <div>
          <div className="card-counter-row">
            Ganze Kartenstapel:
            <div className="card-counter-value">{cardCounter.numberOfWholeCardGamesInStack}</div>
          </div>
          <div className="card-counter-row">
            Running Count:
            <div className="card-counter-value">{cardCounter.runningCount}</div>
          </div>
          <div className="card-counter-row">
            True Count:
            <div className="card-counter-value">{cardCounter.trueCount}</div>
          </div>
          <div className="card-counter-row">
            Einsatz nächste Runde:
            <div className="card-counter-value">
              {cardCounter.standardBetMultiplier}
              {" "}
              x
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardCounter;
