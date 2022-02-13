import React from "react";
import CardColor from "../../model/card/cardColor";
import Card from "../../model/card/card";
import getBasicStrategy, { BasicStrategyResult } from "../../model/strategy/basicStrategy";
import CardNumber from "../../model/card/cardNumber";

const createPlayerCards = (firstCardNumber: CardNumber, secondCardNumber: CardNumber): Card[] => [
  new Card(1, CardColor.SPADES, firstCardNumber, false),
  new Card(2, CardColor.HEARTS, secondCardNumber, false),
];

const createDealerCards = (upCardNumber: CardNumber): Card[] => [
  new Card(3, CardColor.DIAMONDS, upCardNumber, false),
  new Card(5, CardColor.CLUBS, CardNumber.KING, true),
];

describe("Test basic strategy", () => {
  test("Player Hand: 5 - 8 | Dealer Upcard: 2 - A => Hit", () => {
    Object.values(CardNumber).forEach((dealerUpCardNumber) => {
      expect(getBasicStrategy(createPlayerCards(CardNumber.THREE, CardNumber.TWO), createDealerCards(dealerUpCardNumber))).toBe(BasicStrategyResult.HIT);
      expect(getBasicStrategy(createPlayerCards(CardNumber.TWO, CardNumber.FOUR), createDealerCards(dealerUpCardNumber))).toBe(BasicStrategyResult.HIT);
      expect(getBasicStrategy(createPlayerCards(CardNumber.THREE, CardNumber.FOUR), createDealerCards(dealerUpCardNumber))).toBe(BasicStrategyResult.HIT);
      expect(getBasicStrategy(createPlayerCards(CardNumber.FIVE, CardNumber.THREE), createDealerCards(dealerUpCardNumber))).toBe(BasicStrategyResult.HIT);
    });
  });
});
