import Card from "./card";
import CardColor from "./cardColor";
import CardNumber from "./cardNumber";

class CardStack {
  private cards: Card[] = [];

  private numberCardsFullStack = 0;

  public initialize(): void {
    this.fillCarsStack();
    this.shuffle();
  }

  public shift(): Card {
    return this.cards.shift()!;
  }

  public hasToShuffle(): boolean {
    return this.cards.length <= (1 / 3) * this.numberCardsFullStack;
  }

  get size(): number {
    return this.cards.length;
  }

  private fillCarsStack(): void {
    let idCounter = 0;
    for (let i = 0; i < 6; i += 1) {
      // eslint-disable-next-line no-loop-func
      Object.values(CardColor).forEach((cardColor) => {
        Object.values(CardNumber).forEach((cardNumber) => {
          const card = new Card(idCounter, cardColor as CardColor, cardNumber as CardNumber, true);
          this.cards.push(card);
          idCounter += 1;
        });
      });
    }
    this.numberCardsFullStack = this.cards.length;
  }

  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

export default CardStack;
