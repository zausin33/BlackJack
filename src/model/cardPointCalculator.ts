import Card from "./card/card";
import CardNumber from "./card/cardNumber";
import { BLACKJACK_NUMBER } from "./blackjackGameConstants";

const calculateOptimalAcePoints = (value: number, numberAces: number): number => {
  if (numberAces === 0) return value;
  if (value + Card.VALUE_ACE_HIGH > BLACKJACK_NUMBER) return value + numberAces * Card.VALUE_ACE_LOW;
  return value + Card.VALUE_ACE_HIGH + (numberAces - 1) * Card.VALUE_ACE_LOW;
};

const calculateCardPoints = (cards: Card[]): number => {
  let value = 0;
  let numberAces = 0;
  cards.filter((card) => !card.isConcealed).forEach((card) => {
    const valueTmp = parseFloat(card.number);
    if (!Number.isNaN(valueTmp)) {
      value += valueTmp;
    } else if (card.number === CardNumber.ACE) {
      numberAces += 1;
    } else {
      value += Card.VALUE_ROYAL_CARD;
    }
  });
  return calculateOptimalAcePoints(value, numberAces);
};

export default calculateCardPoints;
