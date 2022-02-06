import Card from "../card/card";
import calculateCardPoints from "../cardCounter";
import { BLACKJACK_NUMBER } from "../blackjackGameConstants";
import RoundStatus from "../roundStatus";
import { FinishedHand, Hand } from "./splitHandTypes";

abstract class Player {
  public name = "";

  public hand: Hand = {
    cards: [],
    bet: 0,
  };

  public splitHands: Hand[] = [];

  public finishedSplitHands: FinishedHand[] = [];

  private _numberPlayedGames = 0;

  protected constructor(name: string) {
    this.name = name;
  }

  public get numberPlayedGames(): number {
    return this._numberPlayedGames;
  }

  public increaseNumberPlayedGames(): void {
    this._numberPlayedGames += 1;
  }

  public resetNumberPlayedGames(): void {
    this._numberPlayedGames = 0;
  }

  public addToHand(card: Card): void {
    this.hand.cards.push(card);
  }

  public get cardPoints(): number {
    return calculateCardPoints(this.hand.cards);
  }

  public startRound(): void {
    this.hand.cards = [];
    this.hand.bet = 0;
    this.splitHands = [];
    this.finishedSplitHands = [];
  }

  public split(): void {
    if (this.hand.cards.length !== 2) {
      throw Error("Split is not allowed");
    }

    const cardForSplitHand = this.hand.cards.shift()!;
    cardForSplitHand.wasInSplitHand = true;
    const newSplitHand: Hand = {
      bet: this.hand.bet,
      cards: [cardForSplitHand],
    };
    this.splitHands.push(newSplitHand);
  }

  public switchActiveHand(): void {
    const newActiveHand = this.splitHands.pop();

    const oldHand: FinishedHand = {
      cards: this.hand.cards,
      cardPoints: this.cardPoints,
      hastToMuchPoints: this.cardPoints > BLACKJACK_NUMBER,
      bet: this.hand.bet,
      moneyWonOrLost: 0,
      status: RoundStatus.RUNNING,
    };
    this.finishedSplitHands.unshift(oldHand);

    if (newActiveHand) {
      this.hand = newActiveHand;
    }
  }
}

export default Player;
