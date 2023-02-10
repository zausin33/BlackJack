import HumanPlayer from "../player/humanPlayer";
import BlackjackGame from "../blackjackGame";
import { BasicStrategyResult } from "../strategy/basicStrategy";
import RoundStatus from "../roundStatus";

class Simulator {
  private readonly player: HumanPlayer;

  private readonly blackjackGame: BlackjackGame;

  constructor() {
    this.player = new HumanPlayer("simulator");
    this.blackjackGame = new BlackjackGame(this.player, 0);
  }

  public doSimulate(
    numberGames: number,
    initialRoundBet: number,
    withCardCounter: boolean,
  ): HumanPlayer {
    while (this.player.numberPlayedGames < numberGames) {
      this.simulateOneRound(initialRoundBet, withCardCounter);
    }
    return this.player; // TODO mehrere spiele von startkapital an, startkapital veränderbar machen, abbruch wenn negativ, webworker
  }

  private simulateOneRound(initialRoundBet: number, withCardCounter: boolean):void {
    if (this.blackjackGame.roundStatus === RoundStatus.STARTING) {
      this.simulateRoundStarting(initialRoundBet, withCardCounter);
    }
    while (this.blackjackGame.roundStatus === RoundStatus.RUNNING) {
      this.simulateRoundRunning();
    }
    if (this.blackjackGame.roundStatus === RoundStatus.SHUFFLE) {
      this.blackjackGame.startRound();
    }
    if (![RoundStatus.STARTING, RoundStatus.SHUFFLE, RoundStatus.RUNNING]
      .includes(this.blackjackGame.roundStatus)) {
      this.blackjackGame.startNewRoundOrSwitchActiveHand();
    }
  }

  private simulateRoundRunning(): void {
    const { basicStrategy } = this.blackjackGame;
    switch (basicStrategy) {
      case BasicStrategyResult.HIT:
        this.blackjackGame.takeCardHumanPlayer();
        break;
      case BasicStrategyResult.STAND:
        this.blackjackGame.stand();
        break;
      case BasicStrategyResult.DOUBLE:
        this.blackjackGame.doubleDown();
        break;
      case BasicStrategyResult.SPLIT:
        this.blackjackGame.split();
        break;
      default:
        throw Error("Unknown basic strategy result");
    }
  }

  private simulateRoundStarting(initialRoundBet: number, withCardCounter: boolean): void {
    const { cardCounter } = this.blackjackGame;
    this.blackjackGame.roundBet = initialRoundBet
        * (withCardCounter ? cardCounter.standardBetMultiplier : 1);
    this.blackjackGame.runRound();
  }
}

export default Simulator;
