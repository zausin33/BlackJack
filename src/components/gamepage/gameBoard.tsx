import React, { useEffect, useState } from "react";
import "./gampageStyles.css";
import CardDeck from "./cardDeck";
import ButtonArea from "./buttonArea";
import HumanPlayer from "../../model/player/HumanPlayer";
import BlackjackGame from "../../model/BlackjackGame";
import RoundResultModal from "./roundResultModal";
import RoundStatus from "../../model/RoundStatus";
import CardStack from "./cardStack";
import MoneyArea from "../ui/moneyArea";
import SideArea from "./sideArea";
import RoundStartModal from "./roundStartModal";

type GameBoardProps = {
    player: HumanPlayer;
    profileList: HumanPlayer[];
    setProfileList(profileList: HumanPlayer[]): void;
}

function GameBoard({ player, profileList, setProfileList }: GameBoardProps): JSX.Element {
  // eslint-disable-next-line no-use-before-define
  const [blackjackGames, setBlackjackGame] = useState(() => [new BlackjackGame(player)]);
  const [roundHadEnded, setRoundHadEnded] = useState(false);
  const blackjackGame = blackjackGames[0];
  const { roundStatus } = blackjackGame;

  useEffect(() => {
    if (roundStatus === RoundStatus.RUNNING || roundStatus === RoundStatus.STARTING) {
      setRoundHadEnded(false);
    } else if (roundStatus === RoundStatus.LOST_SPLIT_HAND) {
      setRoundHadEnded(true);
    } else {
      setTimeout(() => {
        setRoundHadEnded(true);
      }, 900);
    }
  }, [roundStatus]);

  const updateGameBoard = ():void => {
    setBlackjackGame([...blackjackGames]);
    setProfileList([...profileList]);
  };

  useEffect(() => {
    blackjackGame.setUpdateUIFunction(updateGameBoard);
  }, []);

  const onHumanTakesCard = (): void => {
    blackjackGame.takeCardHumanPlayer();
    updateGameBoard();
  };

  const onStand = (): void => {
    blackjackGame.stand();
    updateGameBoard();
  };

  const onStartNewRound = (): void => {
    blackjackGame.startNewRoundOrSwitchActiveHand();
    updateGameBoard();
  };

  const onDoubleBet = (): void => {
    blackjackGame.doubleDown();
    updateGameBoard();
  };

  const onPlayerSplit = (): void => {
    blackjackGame.split();
    updateGameBoard();
  };

  const onUpdateRoundBet = (newRoundBet: number): void => {
    blackjackGame.roundBet = newRoundBet;
    updateGameBoard();
  };

  const onConfirmRoundBet = (): void => {
    blackjackGame.runRound();
    updateGameBoard();
  };

  return (
    <div className="game-board-wrapper">
      <div className="game-board">
        <div className="dealer-area">
          <CardDeck player={blackjackGame.dealer} roundStatus={blackjackGame.roundStatus} />
        </div>
        <div className="middle-area">
          <div className="bet-money-area">
            <MoneyArea money={blackjackGame.player.hand.bet} className="money-area" />
          </div>
          <ButtonArea
            onHumanTakesCard={onHumanTakesCard}
            onStand={onStand}
            canPlayerDouble={blackjackGame.canPlayerDoubleDown}
            onDoubleBet={onDoubleBet}
            canPlayerSplit={blackjackGame.canPlayerSplit}
            onPlayerSplit={onPlayerSplit}
            disabled={blackjackGame.roundStatus !== RoundStatus.RUNNING || blackjackGame.isProcessing}
          />
        </div>
        <div className="card-stack-area">
          <CardStack />
        </div>
        <div className="player-area">
          <CardDeck player={blackjackGame.player} roundStatus={blackjackGame.roundStatus} />
          <div className="player-money-area">
            {/* TODO player money < round bet */}
            <MoneyArea money={blackjackGame.player.money} className="money-area" />
          </div>
        </div>
        <RoundStartModal
          show={blackjackGame.roundStatus === RoundStatus.STARTING}
          onConfirmRoundBet={onConfirmRoundBet}
          roundBet={blackjackGame.roundBet}
          onUpdateRoundBet={onUpdateRoundBet}
          playerMoney={blackjackGame.player.money}
        />
        <RoundResultModal
          show={roundHadEnded}
          onHide={onStartNewRound}
          roundStatus={blackjackGame.roundStatus}
          cardValuesDealer={blackjackGame.dealer.cardPoints}
          cardValuesPlayer={blackjackGame.player.cardPoints}
          moneyLostOrWon={blackjackGame.moneyLostOrWon}
          finishedSplitHands={blackjackGame.player.finishedSplitHands}
        />
      </div>
      <div className="side-area"><SideArea /></div>
    </div>
  );
}

export default GameBoard;
