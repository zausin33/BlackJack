import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import HumanPlayer from "../model/player/humanPlayer";
import * as localStorageHook from "../utils/hooks/useLocalStorageForProfiles";
import Card from "../model/card/card";
import CardColor from "../model/card/cardColor";
import CardNumber from "../model/card/cardNumber";
import CardStack from "../model/card/cardStack";

export const createTestUser = (): HumanPlayer => {
  const testUser = new HumanPlayer("Hans Tester");
  testUser.isActive = true;
  return testUser;
};

export const mockUser = (): void => {
  const mockedUser = createTestUser();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  localStorageHook.default = jest.fn(() => [[mockedUser], () => {}]);
};

export const setupCardStack = (cards: Card[] = []): void => {
  const initialCards = [
    ...cards,
    new Card(100006, CardColor.CLUBS, CardNumber.TWO, true),
    new Card(100007, CardColor.DIAMONDS, CardNumber.JACK, true),
    new Card(100008, CardColor.HEARTS, CardNumber.ACE, true),
    new Card(100009, CardColor.DIAMONDS, CardNumber.SEVEN, true),
  ];
  jest.spyOn(CardStack.prototype, "shift").mockImplementation(() => {
    if (initialCards.length) return initialCards.shift()!;
    return CardStack.prototype.shift();
  });
};

export const betFiveEuro = (): void => {
  userEvent.click(screen.getByTestId("chip-5"));
  userEvent.click(screen.getByText("OK"));
};

export const setUpGame = (cards: {color: CardColor, number: CardNumber}[]): void => {
  const initialCards = cards.map(({ color, number }, index) => new Card(100000 + index, color, number, true));
  const firstThreeCards = initialCards.slice(0, 3);
  setupCardStack(initialCards);
  betFiveEuro();
  expect(screen.getByTestId(firstThreeCards[0].imageName)).toBeInTheDocument();
  expect(screen.getByTestId(firstThreeCards[1].imageName)).toBeInTheDocument();
  expect(screen.getByTestId(firstThreeCards[2].imageName)).toBeInTheDocument();
  expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
};
