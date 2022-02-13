import Card from "../card/card";
import CardNumber from "../card/cardNumber";
import calculateCardPoints from "../cardPointCalculator";
import CardColor from "../card/cardColor";
import CardStack from "../card/cardStack";

class CardCounter {
  runningCount = 0;

  private cardStack: CardStack;

  constructor(cardStack: CardStack) {
    this.cardStack = cardStack;
  }

  get numberOfWholeCardGamesInStack(): number {
    const sizeOfOneCardGame = Object.keys(CardNumber).length * Object.keys(CardColor).length;
    return Math.floor(this.cardStack.size / sizeOfOneCardGame);
  }

  get trueCount(): number {
    return Math.round(this.runningCount / this.numberOfWholeCardGamesInStack);
  }

  get standardBetMultiplier(): number {
    if (this.trueCount <= 0) return 1;
    if (this.trueCount <= 1) return 2;
    if (this.trueCount <= 2) return 4;
    if (this.trueCount <= 3) return 8;
    if (this.trueCount <= 4) return 10;
    return 12;
  }

  public addCardToCount(card: Card): void {
    this.runningCount += CardCounter.getHighLowValue(card);
  }

  private static getHighLowValue(card: Card): number {
    if (card.number === CardNumber.ACE) return -1;
    const cardPoints = calculateCardPoints([card]);
    if (cardPoints === 10) return -1;
    if (cardPoints >= 7) return 0;
    return 1;
  }
}

export default CardCounter;
