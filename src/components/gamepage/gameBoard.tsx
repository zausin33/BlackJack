import React, { useState } from "react";
import "./gampageStyles.css";
import CardDeck from "./cardDeck";
import ButtonArea from "./buttonArea";
import MoneyArea from "./moneyArea";
import HumanPlayer from "../../model/player/HumanPlayer";
import BlackjackGame from "../../model/BlackjackGame";
import RoundResultModal from "./roundResultModal";
import RoundStatus from "../../model/RoundStatus";
import CardStack from "./cardStack";

type GameBoardProps = {
    player: HumanPlayer;
    profileList: HumanPlayer[];
    setProfileList(profileList: HumanPlayer[]): void;
}

function GameBoard({ player, profileList, setProfileList }: GameBoardProps): JSX.Element {
  const [blackjackGames, setBlackjackGame] = useState(() => [new BlackjackGame(player)]);
  const blackjackGame = blackjackGames[0];

  const updateGameBoard = ():void => {
    setBlackjackGame([...blackjackGames]);
    setProfileList([...profileList]);
  };

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

  const roundHadEnded = blackjackGame.getRoundStatus() !== RoundStatus.RUNNING;
  return (
    <div className="game-board">
      <div className="dealer-area">
        <CardDeck player={blackjackGame.getDealer()} roundStatus={blackjackGame.getRoundStatus()} />
      </div>
      <div className="middle-area">
        <div className="bet-money-area">
          <MoneyArea money={blackjackGame.getPlayerBet()} />
        </div>
        <ButtonArea
          onHumanTakesCard={onHumanTakesCard}
          onStand={onStand}
          canPlayerDouble={blackjackGame.getCanPlayerDoubleDown()}
          onDoubleBet={onDoubleBet}
          canPlayerSplit={blackjackGame.getCanPlayerSplit()}
          onPlayerSplit={onPlayerSplit}
        />
      </div>
      <div className="card-stack-area">
        <CardStack />
      </div>
      <div className="player-area">
        <CardDeck player={blackjackGame.getHumanPlayer()} roundStatus={blackjackGame.getRoundStatus()} />
        <div className="player-money-area">
          {/* TODO player money < round bet */}
          <MoneyArea money={blackjackGame.getHumanPlayer().getMoney() - blackjackGame.getRoundBet()} />
        </div>
      </div>
      <RoundResultModal
        show={roundHadEnded}
        onHide={onStartNewRound}
        roundStatus={blackjackGame.getRoundStatus()}
        cardValuesDealer={blackjackGame.getDealer().getCardPoints()}
        cardValuesPlayer={blackjackGame.getHumanPlayer().getCardPoints()}
        moneyLostOrWon={blackjackGame.getMoneyLostOrWon()}
        finishedSplitHands={blackjackGame.getHumanPlayer().getFinishedSplitHands()}
      />
    </div>
  );
}

export default GameBoard;
