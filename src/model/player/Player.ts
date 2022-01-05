import Card from "../card/Card";
import calculateCardPoints from "../cardCounter";
import { BLACKJACK_NUMBER } from "../blackjackGameConstants";
import RoundStatus from "../RoundStatus";
import { FinishedSplitHand, SplitHand } from "./splitHandTypes";

abstract class Player {
  private name = "";

  private numberPlayedGames = 0;

  private hand: Card[] = [];

  private splitHands: SplitHand[] = [];

  private finishedSplitHands: FinishedSplitHand[] = [];

  protected constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  protected setName(name: string): void {
    this.name = name;
  }

  public getNumberPlayedGames(): number {
    return this.numberPlayedGames;
  }

  public increaseNumberPlayedGames(): void {
    this.numberPlayedGames += 1;
  }

  public getHand(): Card[] {
    return this.hand;
  }

  public setHand(hand: Card[]): void {
    this.hand = hand;
  }

  public addToHand(card: Card): void {
    const hand = this.getHand();
    hand.push(card);
    this.setHand(hand);
  }

  public getCardPoints(): number {
    return calculateCardPoints(this.hand);
  }

  public getSplitHands(): SplitHand[] {
    return this.splitHands;
  }

  public setSplitHands(splitHands: SplitHand[]): void {
    this.splitHands = splitHands;
  }

  public getFinishedSplitHands(): FinishedSplitHand[] {
    return this.finishedSplitHands;
  }

  public setFinishedSplitHands(finishedSplitHands: FinishedSplitHand[]): void {
    this.finishedSplitHands = finishedSplitHands;
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
      cardPoints: this.getCardPoints(),
      hastToMuchPoints: this.getCardPoints() > BLACKJACK_NUMBER,
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
