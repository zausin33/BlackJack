import React, { useEffect, useState } from "react";
import "./gampageStyles.css";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import CardDeck from "./components/cardDeck/cardDeck";
import ButtonArea from "./components/buttonArea";
import HumanPlayer from "../../model/player/humanPlayer";
import BlackjackGame from "../../model/blackjackGame";
import RoundResultModal from "./components/roundResultModal";
import RoundStatus from "../../model/roundStatus";
import CardStack from "./components/cardStack";
import MoneyArea from "../ui/moneyArea";
import SideArea from "./components/sideArea";
import RoundStartModal from "./components/roundStartModal";
import { SHOW_ROUND_RESULT_MODEL_DELAY } from "../../model/blackjackGameConstants";
import Button from "../ui/button";
import ShuffleModal from "./components/shuffleModal";

type GameBoardProps = {
    player: HumanPlayer;
    profileList: HumanPlayer[];
    setProfileList(profileList: HumanPlayer[]): void;
}

function GameBoard({ player, profileList, setProfileList }: GameBoardProps): JSX.Element {
  const [blackjackGames, setBlackjackGame] = useState(() => [new BlackjackGame(player)]);
  const [roundHadEnded, setRoundHadEnded] = useState(false);
  const [headerElement, setHeaderElement] = useState<HTMLElement | null>();
  const navigate = useNavigate();
  const blackjackGame = blackjackGames[0];
  const { roundStatus } = blackjackGame;

  useEffect(() => {
    if (roundStatus === RoundStatus.RUNNING
        || roundStatus === RoundStatus.STARTING
        || roundStatus === RoundStatus.SHUFFLE) {
      setRoundHadEnded(false);
    } else if (roundStatus === RoundStatus.LOST_SPLIT_HAND) {
      setRoundHadEnded(true);
    } else {
      setTimeout(() => {
        setRoundHadEnded(true);
      }, SHOW_ROUND_RESULT_MODEL_DELAY);
    }
  }, [roundStatus]);

  const updateGameBoard = ():void => {
    setBlackjackGame([...blackjackGames]);
    setProfileList([...profileList]);
  };

  useEffect(() => {
    blackjackGame.setUpdateUIFunction(updateGameBoard);
    setHeaderElement(document.getElementById("end-game-btn-wrapper"));
  }, []);

  const onUpdateRoundBet = (newRoundBet: number): void => {
    blackjackGame.roundBet = newRoundBet;
    updateGameBoard();
  };

  return (
    <div className="game-board-wrapper">
      <div className="game-board">
        <div className="dealer-area" data-testid="dealer-area">
          <CardDeck player={blackjackGame.dealer} roundStatus={blackjackGame.roundStatus} />
        </div>
        <div className="middle-area">
          <div className="bet-money-area">
            <MoneyArea money={blackjackGame.player.hand.bet} className="money-area" />
          </div>
          <ButtonArea
            onHumanTakesCard={() => blackjackGame.takeCardHumanPlayer()}
            onStand={() => blackjackGame.stand()}
            canPlayerDouble={blackjackGame.canPlayerDoubleDown}
            onDoubleBet={() => blackjackGame.doubleDown()}
            canPlayerSplit={blackjackGame.canPlayerSplit}
            onPlayerSplit={() => blackjackGame.split()}
            disabled={blackjackGame.roundStatus !== RoundStatus.RUNNING || blackjackGame.isProcessing}
          />
        </div>
        <div className="card-stack-area">
          <CardStack />
        </div>
        <div className="player-area" data-testid="player-area">
          <CardDeck player={blackjackGame.player} roundStatus={blackjackGame.roundStatus} />
          <div className="player-money-area">
            <MoneyArea money={blackjackGame.player.money} className="money-area" />
          </div>
        </div>
        <RoundStartModal
          show={blackjackGame.roundStatus === RoundStatus.STARTING}
          onConfirmRoundBet={() => blackjackGame.runRound()}
          roundBet={blackjackGame.roundBet}
          onUpdateRoundBet={onUpdateRoundBet}
          playerMoney={blackjackGame.player.money}
        />
        <ShuffleModal
          show={blackjackGame.roundStatus === RoundStatus.SHUFFLE}
          onConfirmShuffle={() => blackjackGame.startRound()}
        />
        <RoundResultModal
          show={roundHadEnded}
          onHide={() => blackjackGame.startNewRoundOrSwitchActiveHand()}
          roundStatus={blackjackGame.roundStatus}
          cardValuesDealer={blackjackGame.dealer.cardPoints}
          cardValuesPlayer={blackjackGame.player.cardPoints}
          moneyLostOrWon={blackjackGame.moneyLostOrWon}
          finishedSplitHands={blackjackGame.player.finishedSplitHands}
        />
      </div>
      <div className="side-area"><SideArea /></div>
      {headerElement && blackjackGame.roundStatus === RoundStatus.STARTING && (
        ReactDOM.createPortal(
          (
            <Button styleType="secondary" onClick={() => navigate("/")}>
              Spiel beenden
            </Button>),
          headerElement,
        ))}
    </div>
  );
}

export default GameBoard;
