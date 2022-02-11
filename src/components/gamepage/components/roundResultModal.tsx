import React, { Fragment } from "react";
import CenteredModal from "../../ui/modal/centeredModal";
import Button from "../../ui/button";
import RoundStatus from "../../../model/roundStatus";
import { FinishedHand } from "../../../model/player/splitHandTypes";
import Money from "../../ui/money";

type roundResultModalProps = {
  show: boolean;
  onHide(): void;
  roundStatus: RoundStatus;
  cardValuesDealer: number;
  cardValuesPlayer: number;
  moneyLostOrWon: number;
  finishedSplitHands: FinishedHand[];
}

function RoundResultModal(props: roundResultModalProps): JSX.Element {
  const {
    show, onHide, roundStatus, cardValuesDealer, cardValuesPlayer, moneyLostOrWon, finishedSplitHands,
  } = props;

  const roundResults = {
    [RoundStatus.STARTING]: "",
    [RoundStatus.SHUFFLE]: "",
    [RoundStatus.WON]: "Gewonnen",
    [RoundStatus.LOST]: "Verloren",
    [RoundStatus.PLAYER_TO_MUCH_POINTS]: "Verloren",
    [RoundStatus.LOST_SPLIT_HAND]: "Aktuelle Hand Überkauft",
    [RoundStatus.TIE]: "Unentschieden",
    [RoundStatus.BLACKJACK]: "Blackjack!",
    [RoundStatus.BLACKJACK_TIE]: "Beide Blackjack - Unentschieden",
    [RoundStatus.RUNNING]: "",
    [RoundStatus.END_SPLIT_ROUND]: "Runde ist zu Ende",
  };
  const roundResult = roundResults[roundStatus];
  const playerHasToMuchPoints = (roundStatus === RoundStatus.PLAYER_TO_MUCH_POINTS
      || roundStatus === RoundStatus.LOST_SPLIT_HAND);

  const renderResultHandHasToMuchPoints = (hand: FinishedHand): JSX.Element => (
    <div>
      Du hast zu viele Augen:
      <span className="result-card-number">{hand.cardPoints}</span>
      {hand.moneyWonOrLost >= 0 ? "Gewonnen:" : "Verloren:"}
      <Money amount={Math.abs(hand.moneyWonOrLost)} className="result-card-number" />
    </div>
  );

  const renderNormalHandResult = (hand: FinishedHand): JSX.Element => (
    <div>
      Du hast
      <span className="result-card-number">{hand.cardPoints}</span>
      {"Augen. "}
      {hand.moneyWonOrLost >= 0 ? "Gewonnen:" : "Verloren:"}
      <Money amount={Math.abs(hand.moneyWonOrLost)} className="result-card-number" />
    </div>
  );

  const renderResultFinishedSplitHand = (hand: FinishedHand): JSX.Element => {
    if (hand.hastToMuchPoints) return renderResultHandHasToMuchPoints(hand);
    return renderNormalHandResult(hand);
  };

  const renderSplitResultText = (): JSX.Element => (
    <div style={{ width: "80%", margin: "auto" }}>
      <div>
        Dealer hat
        <span className="result-card-number">{cardValuesDealer}</span>
        Augen
      </div>
      {/* eslint-disable-next-line react/no-array-index-key */}
      {finishedSplitHands.map((hand, idx) => (<Fragment key={idx}>{renderResultFinishedSplitHand(hand)}</Fragment>))}
      <div />
      <div>
        {`Insgesamt ${moneyLostOrWon >= 0 ? "gewonnen:" : "verloren:"}`}
        <Money amount={Math.abs(moneyLostOrWon)} className="result-card-number" />
      </div>
    </div>
  );

  const renderNormalResultText = (): JSX.Element => (
    <div style={{ width: "50%", margin: "auto" }}>
      <div>
        {`Du hast ${playerHasToMuchPoints ? "zu viele Augen:" : ""}`}
        <span className="result-card-number">{roundStatus === RoundStatus.LOST_SPLIT_HAND ? finishedSplitHands[0].cardPoints : cardValuesPlayer}</span>
        {!playerHasToMuchPoints && "Augen"}
      </div>
      {!playerHasToMuchPoints && (
        <div>
          Dealer hat
          <span className="result-card-number">{cardValuesDealer}</span>
          Augen
        </div>
      )}
      {roundStatus !== RoundStatus.LOST_SPLIT_HAND && (
        <div>
          {moneyLostOrWon >= 0 ? "Gewonnen:" : "Verloren:"}
          <Money amount={Math.abs(moneyLostOrWon)} className="result-card-number" />
        </div>
      )}
    </div>
  );

  return (
    <CenteredModal
      show={show}
      onHide={onHide}
      title={roundResult}
      size="auto"
      hasEdgedCorners
      hasBlackBackground
      footer={(
        <Button
          styleType="primary"
          onClick={onHide}
          size="small"
        >
          OK
        </Button>
      )}
    >
      {roundStatus === RoundStatus.END_SPLIT_ROUND
        ? renderSplitResultText()
        : renderNormalResultText()}
    </CenteredModal>
  );
}

export default RoundResultModal;
