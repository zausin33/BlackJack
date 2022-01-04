import Card from "./Card";
import CardColor from "./CardColor";
import CardNumber from "./CardNumber";

class CardStack {
  private cards: Card[] = [];

  public initialize(): void {
    this.fillCarsStack();
    this.shuffle();
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.EIGHT, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.NINE, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(CardColor.DIAMONDS, CardNumber.SEVEN, true));
  }

  public shift(): Card {
    return this.cards.shift()!;
  }

  private fillCarsStack(): void {
    for (let i = 0; i < 6; i += 1) {
      Object.values(CardColor).forEach((cardColor) => {
        Object.values(CardNumber).forEach((cardNumber) => {
          const card = new Card(cardColor as CardColor, cardNumber as CardNumber, true);
          this.cards.push(card);
        });
      });
    }
  }

  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

export default CardStack;
