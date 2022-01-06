import Card from "../card/Card";
import calculateCardPoints from "../cardCounter";
import { BLACKJACK_NUMBER } from "../blackjackGameConstants";
import RoundStatus from "../RoundStatus";
import { FinishedSplitHand, SplitHand } from "./splitHandTypes";

abstract class Player {
  public name = "";

  public hand: Card[] = [];

  public splitHands: SplitHand[] = [];

  public finishedSplitHands: FinishedSplitHand[] = [];

  private _numberPlayedGames = 0;

  private wasCurrentHandSplitHand = false;

  protected constructor(name: string) {
    this.name = name;
  }

  public get numberPlayedGames(): number {
    return this._numberPlayedGames;
  }

  private set numberPlayedGames(numberPlayedGames: number) {
    this._numberPlayedGames = numberPlayedGames;
  }

  public increaseNumberPlayedGames(): void {
    this._numberPlayedGames += 1;
  }

  public resetNumberPlayedGames(): void {
    this._numberPlayedGames = 0;
  }

  public addToHand(card: Card): void {
    this.hand.push(card);
  }

  public get cardPoints(): number {
    return calculateCardPoints(this.hand);
  }

  public split(playerBet: number): void {
    if (this.hand.length !== 2) {
      throw Error("Split is not allowed");
    }

    const newSplitHand: SplitHand = {
      bet: playerBet,
      card: this.hand.pop()!,
    };
    this.splitHands.push(newSplitHand);
  }

  public switchActiveHand(playerBet: number, moneyWonOrLost: number): number {
    const newActiveHand = this.splitHands.pop();

    const oldHand: FinishedSplitHand = {
      cards: this.hand,
      cardPoints: this.cardPoints,
      hastToMuchPoints: this.cardPoints > BLACKJACK_NUMBER,
      bet: playerBet,
      moneyWonOrLost,
      status: RoundStatus.RUNNING,
    };
    this.finishedSplitHands.unshift(oldHand);

    if (newActiveHand) {
      this.hand = [newActiveHand.card];
      return newActiveHand.bet;
    }
    return playerBet;
  }
}

export default Player;
