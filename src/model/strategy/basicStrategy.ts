import Card from "../card/card";
import CardNumber from "../card/cardNumber";
import calculateCardPoints from "../cardPointCalculator";

export enum BasicStrategyResult {
    HIT = "hit",
    STAND = "stand",
    SPLIT = "split",
    DOUBLE = "double"
}

const areBothCardsEqualWithValue = (cardsPlayer: Card[], number: number): boolean => cardsPlayer[0].number === cardsPlayer[1].number && calculateCardPoints([cardsPlayer[0]]) === number;

const checkForSplit = (cardsPlayer: Card[], cardValueDealer: number): BasicStrategyResult | undefined => {
  // 2,2 || 3,3
  if (areBothCardsEqualWithValue(cardsPlayer, 2) || areBothCardsEqualWithValue(cardsPlayer, 3)) {
    if (cardValueDealer <= 7) {
      return BasicStrategyResult.SPLIT;
    }
    return BasicStrategyResult.HIT;
  }
  // 4,4
  if (areBothCardsEqualWithValue(cardsPlayer, 4)) {
    if (cardValueDealer <= 4) {
      return BasicStrategyResult.HIT;
    }
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.SPLIT;
    }
    return BasicStrategyResult.HIT;
  }
  // 5,5
  if (areBothCardsEqualWithValue(cardsPlayer, 5)) {
    if (cardValueDealer <= 9) {
      return BasicStrategyResult.DOUBLE;
    }
    return BasicStrategyResult.HIT;
  }
  // 6,6
  if (areBothCardsEqualWithValue(cardsPlayer, 6)) {
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.SPLIT;
    }
    return BasicStrategyResult.HIT;
  }
  // 7,7
  if (areBothCardsEqualWithValue(cardsPlayer, 7)) {
    if (cardValueDealer <= 7) {
      return BasicStrategyResult.SPLIT;
    }
    return BasicStrategyResult.HIT;
  }
  // 8,8
  if (areBothCardsEqualWithValue(cardsPlayer, 8)) {
    return BasicStrategyResult.SPLIT;
  }
  // 9,9
  if (areBothCardsEqualWithValue(cardsPlayer, 9)) {
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.SPLIT;
    }
    if (cardValueDealer === 7) {
      return BasicStrategyResult.STAND;
    }
    if (cardValueDealer <= 9) {
      return BasicStrategyResult.SPLIT;
    }
    return BasicStrategyResult.STAND;
  }
  // 10,10
  if (areBothCardsEqualWithValue(cardsPlayer, 10)) {
    return BasicStrategyResult.STAND;
  }
  // A,A
  if (cardsPlayer[0].number === CardNumber.ACE && cardsPlayer[1].number === CardNumber.ACE) {
    return BasicStrategyResult.SPLIT;
  }
  return undefined;
};

const doubleIfAllowedOtherwiseHit = (cardsPlayer: Card[]): BasicStrategyResult => (cardsPlayer.length === 2 ? BasicStrategyResult.DOUBLE : BasicStrategyResult.HIT);

const playerHasAce = (cardsPlayer: Card[]):boolean => cardsPlayer.filter((card) => card.number === CardNumber.ACE).length > 0;

const getBasicStrategyWithAce = (cardsPlayer: Card[], cardValueDealer: number): BasicStrategyResult => {
  const valuePlayerNoAces = calculateCardPoints(cardsPlayer.filter((card) => card.number !== CardNumber.ACE));
  // A,2 || A,3
  if (valuePlayerNoAces <= 3) {
    if (cardValueDealer <= 4) {
      return BasicStrategyResult.HIT;
    }
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.DOUBLE;
    }
    return BasicStrategyResult.HIT;
  }
  // A,4 || A,5
  if (valuePlayerNoAces <= 5) {
    if (cardValueDealer <= 3) {
      return BasicStrategyResult.HIT;
    }
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.DOUBLE;
    }
    return BasicStrategyResult.HIT;
  }
  // A, 6
  if (valuePlayerNoAces === 6) {
    if (cardValueDealer === 2) {
      return BasicStrategyResult.HIT;
    }
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.DOUBLE;
    }
    return BasicStrategyResult.HIT;
  }
  // A, 7
  if (valuePlayerNoAces === 7) {
    if (cardValueDealer === 2) {
      return BasicStrategyResult.STAND;
    }
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.DOUBLE;
    }
    if (cardValueDealer <= 8) {
      return BasicStrategyResult.STAND;
    }
    return BasicStrategyResult.HIT;
  }
  // A,8 || A,9 || A,10
  return BasicStrategyResult.STAND;
};

const getRestBasicStrategy = (cardValuePlayer: number, cardsPlayer: Card[], cardValueDealer: number): BasicStrategyResult => {
// 5-8
  if (cardValuePlayer <= 8) {
    return BasicStrategyResult.HIT;
  }
  // 9
  if (cardValuePlayer === 9) {
    if (cardValueDealer === 2) {
      return BasicStrategyResult.HIT;
    }
    if (cardValueDealer <= 6) {
      return doubleIfAllowedOtherwiseHit(cardsPlayer);
    }
    return BasicStrategyResult.HIT;
  }
  // 10
  if (cardValuePlayer === 10) {
    if (cardValueDealer <= 9) {
      return doubleIfAllowedOtherwiseHit(cardsPlayer);
    }
    return BasicStrategyResult.HIT;
  }
  // 11
  if (cardValuePlayer === 11) {
    if (cardValueDealer <= 10) {
      return doubleIfAllowedOtherwiseHit(cardsPlayer);
    }
    return BasicStrategyResult.HIT;
  }
  // 12
  if (cardValuePlayer === 12) {
    if (cardValueDealer <= 3) {
      return BasicStrategyResult.HIT;
    }
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.STAND;
    }
    return BasicStrategyResult.HIT;
  }
  // 13 - 16
  if (cardValuePlayer <= 16) {
    if (cardValueDealer <= 6) {
      return BasicStrategyResult.STAND;
    }
    return BasicStrategyResult.HIT;
  }
  // 17 +
  return BasicStrategyResult.STAND;
};

const getBasicStrategy = (cardsPlayer: Card[], cardsDealer:Card[]): BasicStrategyResult => {
  const dealerUpCard = cardsDealer.filter((card) => !card.isConcealed)[0];
  const cardValueDealer = dealerUpCard.number === CardNumber.ACE ? 11 : calculateCardPoints([dealerUpCard]);
  const cardValuePlayer = calculateCardPoints(cardsPlayer);

  if (cardsPlayer.length === 2) {
    const checkForSplitResult = checkForSplit(cardsPlayer, cardValueDealer);
    if (checkForSplitResult) return checkForSplitResult;
    if (playerHasAce(cardsPlayer)) {
      return getBasicStrategyWithAce(cardsPlayer, cardValueDealer);
    }
  }

  return getRestBasicStrategy(cardValuePlayer, cardsPlayer, cardValueDealer);
};

export default getBasicStrategy;
