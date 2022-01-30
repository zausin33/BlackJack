import Card from "./Card";
import CardColor from "./CardColor";
import CardNumber from "./CardNumber";

class CardStack {
  private cards: Card[] = [];

  public initialize(): void {
    this.fillCarsStack();
    this.shuffle();
    this.cards.unshift(new Card(100001, CardColor.DIAMONDS, CardNumber.JACK, true));
    this.cards.unshift(new Card(100001, CardColor.DIAMONDS, CardNumber.EIGHT, true));
    this.cards.unshift(new Card(100002, CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(100003, CardColor.DIAMONDS, CardNumber.EIGHT, true));
    this.cards.unshift(new Card(100004, CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(100005, CardColor.DIAMONDS, CardNumber.KING, true));
    this.cards.unshift(new Card(100006, CardColor.CLUBS, CardNumber.TWO, true));
    this.cards.unshift(new Card(100007, CardColor.DIAMONDS, CardNumber.SEVEN, true));
    this.cards.unshift(new Card(100008, CardColor.HEARTS, CardNumber.TWO, true));
    this.cards.unshift(new Card(100009, CardColor.DIAMONDS, CardNumber.SEVEN, true));
  }

  public shift(): Card {
    return this.cards.shift()!;
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
  }

  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

export default CardStack;
