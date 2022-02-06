import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import AppRouter from "../../appRouter";
import {
  betFiveEuro, mockUser, setupCardStack, setUpGame,
} from "../testSetup";
import Card from "../../model/card/card";
import CardColor from "../../model/card/cardColor";
import CardNumber from "../../model/card/cardNumber";

describe("Test basic game functions", () => {
  beforeEach(() => {
    mockUser();
    setupCardStack();
    window.history.pushState({}, "Test page", "/blackjack");
    render(<AppRouter />, { wrapper: BrowserRouter });
  });

  test("cards are outlined", () => {
    expect(screen.queryByTestId("concealed.png")).toBeNull();
    userEvent.click(screen.getByAltText("chip-5"));
    userEvent.click(screen.getByText("OK"));
    const dealerArea = screen.getByTestId("dealer-area");
    const playerArea = screen.getByTestId("player-area");
    expect(dealerArea).toContainElement(screen.getByTestId("concealed.png"));
    expect(dealerArea).toContainElement(screen.getByTestId("Diamonds-Jack.png"));
    expect(playerArea).toContainElement(screen.getByTestId("Clubs-2.png"));
    expect(playerArea).toContainElement(screen.getByTestId("Hearts-Ace.png"));
  });

  describe("stand", () => {
    test("stand with lose", async () => {
      betFiveEuro();
      userEvent.click(screen.getByText("Halten"));
      const dealerArea = screen.getByTestId("dealer-area");
      expect(screen.queryByTestId("concealed.png")).toBeNull();
      expect(dealerArea).toContainElement(screen.getByTestId("Diamonds-Jack.png"));
      expect(dealerArea).toContainElement(screen.getByTestId("Diamonds-7.png"));
      expect(screen.queryByText("Verloren")).toBeNull();
      expect(await screen.findByText("Verloren")).toBeInTheDocument();
    });
    test("stand with win", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.JACK },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.QUEEN },
        { color: CardColor.DIAMONDS, number: CardNumber.ACE },
      ]);
      userEvent.click(screen.getByText("Halten"));
      expect(screen.queryByText("Gewonnen")).toBeNull();
      expect(await screen.findByText("Gewonnen")).toBeInTheDocument();
    });
    test("stand with tie", async () => {
      setupCardStack([new Card(100006, CardColor.HEARTS, CardNumber.JACK, true)]);
      betFiveEuro();
      userEvent.click(screen.getByText("Halten"));
      expect(screen.queryByText("Diamonds-7.png")).toBeNull();
      expect(screen.queryByText("Unentschieden")).toBeNull();
      await screen.findByTestId("Diamonds-7.png");
      expect(await screen.findByText("Unentschieden")).toBeInTheDocument();
    });
  });

  describe("blackjack", () => {
    test("only player blackjack", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.JACK },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.ACE },
      ]);
      expect(await screen.findByTestId("Diamonds-Ace.png"));
      expect(screen.queryByText("Blackjack!")).toBeNull();
      expect(await screen.findByText("Blackjack!")).toBeInTheDocument();
      expect(screen.getByText("12.50 €")).toBeInTheDocument();
    });
    test("both blackjack", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.JACK },
        { color: CardColor.DIAMONDS, number: CardNumber.KING },
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.ACE },
      ]);
      expect(await screen.findByTestId("Diamonds-Ace.png"));
      expect(screen.queryByText("Beide Blackjack - Unentschieden")).toBeNull();
      expect(await screen.findByText("Beide Blackjack - Unentschieden")).toBeInTheDocument();
      expect(screen.getByText("5.00 €")).toBeInTheDocument();
    });
  });

  describe("take one card", () => {
    test("take one card win", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
      ]);
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();

      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-Ace.png")).toBeInTheDocument();
      expect(screen.queryByText("Gewonnen")).toBeNull();
      expect(await screen.findByText("Gewonnen")).toBeInTheDocument();
      expect(screen.getByText("10.00 €")).toBeInTheDocument();
    });
    test("take one card overbuy", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.KING },
      ]);
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-King.png")).toBeInTheDocument();
      expect(screen.queryByText("Verloren")).toBeNull();
      expect(await screen.findByText("Verloren")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.getByText("Du hast zu viele Augen:")).toBeInTheDocument();
      expect(screen.getByText("0.00 €")).toBeInTheDocument();
    });
    test("take one card lose without overbuy", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
        { color: CardColor.SPADES, number: CardNumber.SIX },
      ]);
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-2.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();

      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-6.png")).toBeNull();
      expect(await screen.findByTestId("Spades-6.png")).toBeInTheDocument();

      expect(screen.queryByText("Verloren")).toBeNull();
      expect(await screen.findByText("Verloren")).toBeInTheDocument();
      expect(screen.getByText("0.00 €")).toBeInTheDocument();
    });
  });

  describe("take multiple cards", () => {
    test("take multiple cards win", async () => {
      setUpGame([
        // Cards lined out
        { color: CardColor.CLUBS, number: CardNumber.THREE },
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cars player takes
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
        { color: CardColor.HEARTS, number: CardNumber.TWO },
        { color: CardColor.SPADES, number: CardNumber.FIVE },
        // Cards dealer takes
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.SPADES, number: CardNumber.TWO },
        { color: CardColor.SPADES, number: CardNumber.FOUR },
      ]);
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Hearts-2.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Spades-5.png")).toBeInTheDocument();

      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Halten"));

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-2.png")).toBeNull();
      expect(await screen.findByTestId("Spades-2.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-4.png")).toBeNull();
      expect(await screen.findByTestId("Spades-4.png")).toBeInTheDocument();

      expect(screen.queryByText("Gewonnen")).toBeNull();
      expect(await screen.findByText("Gewonnen")).toBeInTheDocument();
      expect(screen.getByText("10.00 €")).toBeInTheDocument();
    });
    test("take multiple cards overbuy", async () => {
      setUpGame([
        // Cards lined out
        { color: CardColor.CLUBS, number: CardNumber.THREE },
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cars player takes
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
        { color: CardColor.HEARTS, number: CardNumber.TWO },
        { color: CardColor.SPADES, number: CardNumber.SEVEN },
      ]);
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Hearts-2.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Spades-7.png")).toBeInTheDocument();

      expect(screen.queryByText("Verloren")).toBeNull();
      expect(await screen.findByText("Verloren")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.getByText("Du hast zu viele Augen:")).toBeInTheDocument();
      expect(screen.getByText("0.00 €")).toBeInTheDocument();
    });
    test("take multiple cards lose without overbuy", async () => {
      setUpGame([
        // Cards lined out
        { color: CardColor.CLUBS, number: CardNumber.THREE },
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cars player takes
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
        { color: CardColor.HEARTS, number: CardNumber.TWO },
        { color: CardColor.SPADES, number: CardNumber.FOUR },
        // Cards dealer takes
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.SPADES, number: CardNumber.TWO },
        { color: CardColor.SPADES, number: CardNumber.FIVE },
      ]);
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Hearts-2.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Spades-4.png")).toBeInTheDocument();

      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Halten"));

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-2.png")).toBeNull();
      expect(await screen.findByTestId("Spades-2.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-5.png")).toBeNull();
      expect(await screen.findByTestId("Spades-5.png")).toBeInTheDocument();

      expect(screen.queryByText("Verloren")).toBeNull();
      expect(await screen.findByText("Verloren")).toBeInTheDocument();
      expect(screen.getByText("0.00 €")).toBeInTheDocument();
    });
  });

  describe("double", () => {
    test("double win", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
        { color: CardColor.SPADES, number: CardNumber.NINE },
      ]);
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      expect(screen.getByText("Noch eine Karte")).toBeDisabled();

      expect(await screen.findByTestId("Diamonds-2.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-9.png")).toBeNull();
      expect(await screen.findByTestId("Spades-9.png")).toBeInTheDocument();

      expect(screen.queryByText("Gewonnen")).toBeNull();
      expect(await screen.findByText("Gewonnen")).toBeInTheDocument();
      expect(screen.getByText("20.00 €")).toBeInTheDocument();
    });
    test("double overbuy", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.KING },
      ]);
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Diamonds-King.png")).toBeInTheDocument();
      expect(screen.getByText("Noch eine Karte")).toBeDisabled();

      expect(screen.queryByText("Verloren")).toBeNull();
      expect(await screen.findByText("Verloren")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.getByText("Du hast zu viele Augen:")).toBeInTheDocument();
      expect(screen.getByText("0.00 €")).toBeInTheDocument();
    });
    test("double lose without overbuy", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
        { color: CardColor.SPADES, number: CardNumber.SIX },
      ]);
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Diamonds-2.png")).toBeInTheDocument();
      expect(screen.getByText("Noch eine Karte")).toBeDisabled();

      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-6.png")).toBeNull();
      expect(await screen.findByTestId("Spades-6.png")).toBeInTheDocument();

      expect(screen.queryByText("Verloren")).toBeNull();
      expect(await screen.findByText("Verloren")).toBeInTheDocument();
      expect(screen.getByText("0.00 €")).toBeInTheDocument();
    });
  });
});
