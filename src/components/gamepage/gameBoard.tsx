import React, { useEffect, useState } from "react";
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
  const [roundHadEnded, setRoundHadEnded] = useState(false);
  const blackjackGame = blackjackGames[0];
  const { roundStatus } = blackjackGame;

  useEffect(() => {
    if (roundStatus === RoundStatus.RUNNING) {
      setRoundHadEnded(false);
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

  return (
    <div className="game-board">
      <div className="dealer-area">
        <CardDeck player={blackjackGame.dealer} roundStatus={blackjackGame.roundStatus} />
      </div>
      <div className="middle-area">
        <div className="bet-money-area">
          <MoneyArea money={blackjackGame.playerBet} />
        </div>
        <ButtonArea
          onHumanTakesCard={onHumanTakesCard}
          onStand={onStand}
          canPlayerDouble={blackjackGame.canPlayerDoubleDown}
          onDoubleBet={onDoubleBet}
          canPlayerSplit={blackjackGame.canPlayerSplit}
          onPlayerSplit={onPlayerSplit}
          disabled={blackjackGame.roundStatus !== RoundStatus.RUNNING}
        />
      </div>
      <div className="card-stack-area">
        <CardStack />
      </div>
      <div className="player-area">
        <CardDeck player={blackjackGame.player} roundStatus={blackjackGame.roundStatus} />
        <div className="player-money-area">
          {/* TODO player money < round bet */}
          <MoneyArea money={blackjackGame.player.money - blackjackGame.roundBet} />
        </div>
      </div>
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
  );
}

export default GameBoard;
