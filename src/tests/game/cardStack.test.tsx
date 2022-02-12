import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import React from "react";
import AppRouter from "../../appRouter";
import { betFiveEuro, mockUser } from "../testSetup";
import CardStack from "../../model/card/cardStack";
import Card from "../../model/card/card";
import CardColor from "../../model/card/cardColor";
import CardNumber from "../../model/card/cardNumber";

describe("Test card stack", () => {
  let cardStackInitializeSpy: jest.SpyInstance<void, []>;
  beforeEach(() => {
    mockUser();
    cardStackInitializeSpy = jest.spyOn(CardStack.prototype, "initialize")
      .mockImplementation(function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
        this.cards = [
          new Card(100006, CardColor.CLUBS, CardNumber.KING, true),
          new Card(100007, CardColor.CLUBS, CardNumber.JACK, true),
          new Card(100008, CardColor.CLUBS, CardNumber.QUEEN, true),
          new Card(100009, CardColor.CLUBS, CardNumber.ACE, true),
          new Card(100010, CardColor.DIAMONDS, CardNumber.KING, true),
          new Card(100011, CardColor.DIAMONDS, CardNumber.JACK, true),
          new Card(100012, CardColor.DIAMONDS, CardNumber.QUEEN, true),
          new Card(100013, CardColor.DIAMONDS, CardNumber.ACE, true),
          new Card(100014, CardColor.SPADES, CardNumber.TWO, true),
          new Card(100015, CardColor.SPADES, CardNumber.JACK, true),
          new Card(100016, CardColor.SPADES, CardNumber.ACE, true),
          new Card(100017, CardColor.SPADES, CardNumber.SEVEN, true),
        ];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.numberCardsFullStack = 12;
      });
    window.history.pushState({}, "Test page", "/blackjack");
    render(<AppRouter />, { wrapper: BrowserRouter });
  });
  test("cards stack shuffles, when 2/3 of the cards are played", async () => {
    expect(cardStackInitializeSpy.mock.calls.length).toBe(1);
    betFiveEuro();
    userEvent.click(screen.getByText("Halten"));
    expect(await screen.findByTestId("Clubs-Ace.png"));
    expect(await screen.findByText("Verloren")).toBeInTheDocument();
    userEvent.click(screen.getByText("OK"));
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));

    expect(await screen.getByText("Wähle deinen Einsatz"));
    userEvent.click(screen.getByText("OK"));

    userEvent.click(screen.getByText("Halten"));
    expect(await screen.findByText("Verloren")).toBeInTheDocument();
    expect(cardStackInitializeSpy.mock.calls.length).toBe(1);
    userEvent.click(screen.getByText("OK"));

    expect(await screen.findByText("Der Kartenstapel wird neu gemischt")).toBeInTheDocument();
    userEvent.click(screen.getByText("OK"));
    expect(cardStackInitializeSpy.mock.calls.length).toBe(2);
  });
  afterEach(() => {
    cardStackInitializeSpy.mockClear();
  });
});
