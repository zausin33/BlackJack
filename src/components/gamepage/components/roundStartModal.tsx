import React, { useEffect, useState } from "react";
import CenteredModal from "../../ui/modal/centeredModal";
import Button from "../../ui/button";
import ChipButton from "../../ui/chipButton";
import { availableChips, chipsFolder } from "../../../utils/chipHelpers";
import Money from "../../ui/money";
import { placeElementsInCircle } from "../../../utils/domHelpers";

type roundStartModalProps = {
  show: boolean;
  onUpdateRoundBet(newRoundBet: number): void;
  onConfirmRoundBet(): void;
  roundBet: number;
  playerMoney: number;
}

function RoundStartModal(props: roundStartModalProps): JSX.Element {
  const {
    show, onUpdateRoundBet, roundBet, onConfirmRoundBet, playerMoney,
  } = props;

  const [roundBetHistory, setRoundBetHistory] = useState<number[]>([0]);
  const [availablePlayerMoney, setAvailablePlayerMoney] = useState(playerMoney);

  const updateRoundBet = (newRoundBet: number): void => {
    onUpdateRoundBet(newRoundBet);
    setRoundBetHistory([...roundBetHistory, newRoundBet]);
    setAvailablePlayerMoney(playerMoney - newRoundBet);
  };

  const redoUpdateRoundBet = (): void => {
    if (roundBetHistory.length > 1) {
      roundBetHistory.pop();
      const newRoundBet = roundBetHistory[roundBetHistory.length - 1];
      onUpdateRoundBet(newRoundBet);
      setRoundBetHistory([...roundBetHistory]);
      setAvailablePlayerMoney(playerMoney - newRoundBet);
    } else {
      onUpdateRoundBet(0);
      setAvailablePlayerMoney(playerMoney);
    }
  };

  useEffect(() => {
    placeElementsInCircle(".circle-graph", ".circle");
  });

  useEffect(() => {
    if (roundBet > playerMoney) {
      onUpdateRoundBet(0);
    }
  }, [roundBet, playerMoney]);

  const confirmRoundBet = (): void => {
    setRoundBetHistory([roundBetHistory[roundBetHistory.length - 1]]);
    onConfirmRoundBet();
  };

  return (
    <CenteredModal
      show={show}
      onHide={onConfirmRoundBet}
      title="Wähle deinen Einsatz"
      size="auto"
      hasEdgedCorners
      hasBlackBackground
      isClosable={false}
      footer={(
        <Button
          styleType="primary"
          onClick={confirmRoundBet}
          size="small"
          disabled={roundBet === 0}
        >
          OK
        </Button>
      )}
    >
      <div className="circle-wrapper">
        <div className="circle-graph">
          <ChipButton chip="undo" onClick={() => redoUpdateRoundBet()} disabled={roundBet === 0} />
          {availableChips.map((chip) => (
            <ChipButton
              chip={chip}
              key={chip}
              onClick={() => updateRoundBet(roundBet + chip)}
              disabled={availablePlayerMoney < chip}
            />
          ))}
          <ChipButton
            chip="double"
            onClick={() => updateRoundBet(roundBet * 2)}
            disabled={roundBet === 0 || availablePlayerMoney < roundBet * 2}
          />
        </div>
        <div>
          <Money amount={roundBet} />
        </div>
      </div>
    </CenteredModal>
  );
}

export default RoundStartModal;
