import React from "react";
import { BasicStrategyResult } from "../../../../model/strategy/basicStrategy";
import CardCounterModel from "../../../../model/strategy/cardCounter";
import BasicStrategy from "./basicStrategy";
import CardCounter from "./cardCounter";
import RoundStatus from "../../../../model/roundStatus";

type SideAreaProps = {
  basicStrategy: BasicStrategyResult | undefined;
  cardCounter: CardCounterModel;
  roundStatus: RoundStatus;
    useBasicStrategy: boolean;
    useCardCounter: boolean;
}

function SideArea({
  basicStrategy, cardCounter, roundStatus, useBasicStrategy, useCardCounter,
}: SideAreaProps): JSX.Element {
  return (
    <div>
      {useBasicStrategy && (
        <BasicStrategy basicStrategy={basicStrategy} />
      )}
      {useCardCounter && (
        <CardCounter cardCounter={cardCounter} roundStatus={roundStatus} />
      )}

    </div>
  );
}

export default SideArea;
