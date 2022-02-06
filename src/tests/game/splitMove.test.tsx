import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import AppRouter from "../../appRouter";
import { mockUser, setUpGame } from "../testSetup";
import CardColor from "../../model/card/cardColor";
import CardNumber from "../../model/card/cardNumber";

describe("Test player splits cards", () => {
  beforeEach(() => {
    mockUser();
    window.history.pushState({}, "Test page", "/blackjack");
    render(<AppRouter />, { wrapper: BrowserRouter });
  });

  describe("Player Split Aces", () => {
    test("both hands win", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.QUEEN },
        // Cars player takes
        { color: CardColor.HEARTS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
      ]);
      userEvent.click(screen.getByText("Splitten"));

      expect(await screen.findByTestId("Hearts-9.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-8.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-8.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Diamonds-Queen.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-Queen.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getByText("20.00 €")).toBeInTheDocument();
    });
    test("both hands lose", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.QUEEN },
        // Cars player takes
        { color: CardColor.HEARTS, number: CardNumber.FIVE },
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
      ]);
      userEvent.click(screen.getByText("Splitten"));

      expect(await screen.findByTestId("Hearts-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-2.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-2.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Diamonds-Queen.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-Queen.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getAllByText("0.00 €")).not.toBeNull();
    });
    test("one tie, other hand loses", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.QUEEN },
        // Cars player takes
        { color: CardColor.HEARTS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
      ]);
      userEvent.click(screen.getByText("Splitten"));

      expect(await screen.findByTestId("Hearts-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-4.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Diamonds-Queen.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-Queen.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getAllByText("5.00 €")).not.toBeNull();
    });
  });

  describe("Player only splits once", () => {
    test("hold one hand and win, other hand take one card and hold with win", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cars player takes
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
        { color: CardColor.DIAMONDS, number: CardNumber.NINE },
        // Cards dealer takes
        { color: CardColor.SPADES, number: CardNumber.FOUR },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-Ace.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-4.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-9.png")).toBeNull();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-9.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-5.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-4.png")).toBeNull();
      expect(await screen.findByTestId("Spades-4.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getByText("20.00 €")).toBeInTheDocument();
    });
    test("hold one hand and lose, other hand take one card and overbuy", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cards player takes
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.NINE },
        // Cards dealer takes
        { color: CardColor.SPADES, number: CardNumber.EIGHT },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-Ace.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-9.png")).toBeNull();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-9.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-5.png")).toBeNull();

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-8.png")).toBeNull();
      expect(await screen.findByTestId("Spades-8.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getAllByText("0.00 €")).not.toBeNull();
    });
    test("take one card and hold with lose, other hand double with overbuy", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cards player takes
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.DIAMONDS, number: CardNumber.NINE },
        // Cards dealer takes
        { color: CardColor.SPADES, number: CardNumber.EIGHT },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-Ace.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-9.png")).toBeNull();
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Diamonds-9.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-5.png")).toBeNull();

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-8.png")).toBeNull();
      expect(await screen.findByTestId("Spades-8.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getAllByText("0.00 €")).not.toBeNull();
    });
    test("double with lose, other hand double with win", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cards player takes
        { color: CardColor.HEARTS, number: CardNumber.FOUR },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.SPADES, number: CardNumber.FIVE },
        { color: CardColor.HEARTS, number: CardNumber.NINE },
        // Cards dealer takes
        { color: CardColor.SPADES, number: CardNumber.SEVEN },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-4.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-5.png")).toBeNull();
      expect(await screen.findByTestId("Spades-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Hearts-9.png")).toBeNull();
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Hearts-9.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-5.png")).toBeNull();

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-7.png")).toBeNull();
      expect(await screen.findByTestId("Spades-7.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getAllByText("20.00 €")).not.toBeNull();
    });
    test("double both hands with win", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cards player takes
        { color: CardColor.HEARTS, number: CardNumber.FOUR },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.SPADES, number: CardNumber.FIVE },
        { color: CardColor.HEARTS, number: CardNumber.NINE },
        // Cards dealer takes
        { color: CardColor.SPADES, number: CardNumber.JACK },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-4.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-5.png")).toBeNull();
      expect(await screen.findByTestId("Spades-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Hearts-9.png")).toBeNull();
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Hearts-9.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-5.png")).toBeNull();

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-Jack.png")).toBeNull();
      expect(await screen.findByTestId("Spades-Jack.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getByText("40.00 €")).toBeInTheDocument();
    });
    test("overbuy both hands", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cars player first hand
        { color: CardColor.HEARTS, number: CardNumber.FOUR },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.SPADES, number: CardNumber.FIVE },
        // Cars player second hand
        { color: CardColor.HEARTS, number: CardNumber.NINE },
        { color: CardColor.HEARTS, number: CardNumber.QUEEN },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-4.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-5.png")).toBeNull();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Spades-5.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Hearts-9.png")).toBeNull();
      expect(screen.queryByText("Du hast zu viele Augen:")).toBeNull();
      expect(await screen.findByTestId("Hearts-9.png")).toBeInTheDocument();
      expect(await screen.findByText("Du hast zu viele Augen:")).toBeInTheDocument();
      expect(screen.getByText("Du hast zu viele Augen:")).toBeInTheDocument();
      userEvent.click(screen.getByText("OK"));

      expect(screen.queryByTestId("Hearts-Queen.png")).toBeNull();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Hearts-Queen.png")).toBeInTheDocument();

      expect(await screen.findByTestId("Hearts-9.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getAllByText("0.00 €")).not.toBeNull();
    });
    test("hold both hands, win one, lose other", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Card first player hand
        { color: CardColor.HEARTS, number: CardNumber.ACE },
        // Card second player hand
        { color: CardColor.DIAMONDS, number: CardNumber.NINE },
        // Cards dealer takes
        { color: CardColor.SPADES, number: CardNumber.FOUR },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-Ace.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-9.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-9.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-4.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));

      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-4.png")).toBeNull();
      expect(await screen.findByTestId("Spades-4.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getAllByText("10.00 €")).not.toBeNull();
    });
    test("take both hands multiple cards, win both", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cards player first hand
        { color: CardColor.HEARTS, number: CardNumber.FOUR },
        { color: CardColor.DIAMONDS, number: CardNumber.SIX },
        { color: CardColor.SPADES, number: CardNumber.FOUR },
        // Cards player second hand
        { color: CardColor.HEARTS, number: CardNumber.NINE },
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
        // Cards dealer takes
        { color: CardColor.DIAMONDS, number: CardNumber.TWO },
        { color: CardColor.DIAMONDS, number: CardNumber.THREE },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-4.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-6.png")).toBeNull();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-6.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Spades-4.png")).toBeNull();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Spades-4.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Hearts-9.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Hearts-9.png")).toBeInTheDocument();
      userEvent.click(screen.getByText("Noch eine Karte"));
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();
      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();

      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-2.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-2.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-3.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-3.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getByText("20.00 €")).toBeInTheDocument();
    });
  });

  describe("Player splits multiple times", () => {
    test("split, hold -> tie, split -> (double -> win, double -> lose)", async () => {
      setUpGame([
        { color: CardColor.CLUBS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.EIGHT },
        { color: CardColor.HEARTS, number: CardNumber.SEVEN },
        { color: CardColor.DIAMONDS, number: CardNumber.FIVE },
        // Cards player first hand
        { color: CardColor.HEARTS, number: CardNumber.JACK },
        // Cards player second Hand
        { color: CardColor.DIAMONDS, number: CardNumber.SEVEN },
        { color: CardColor.SPADES, number: CardNumber.FIVE },
        { color: CardColor.HEARTS, number: CardNumber.NINE },
        // Cards player third hand
        { color: CardColor.DIAMONDS, number: CardNumber.QUEEN },
        { color: CardColor.DIAMONDS, number: CardNumber.JACK },
        // Cards dealer takes
        { color: CardColor.DIAMONDS, number: CardNumber.FOUR },
      ]);
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Hearts-Jack.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Diamonds-7.png")).toBeNull();
      userEvent.click(screen.getByText("Halten"));
      expect(await screen.findByTestId("Diamonds-7.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Spades-5.png")).toBeNull();
      userEvent.click(screen.getByText("Splitten"));
      expect(await screen.findByTestId("Spades-5.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Hearts-9.png")).toBeNull();
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Hearts-9.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Diamonds-Queen.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-Queen.png")).toBeInTheDocument();

      expect(screen.queryByTestId("Diamonds-Jack.png")).toBeNull();
      userEvent.click(screen.getByText("Einsatz verdoppeln"));
      expect(await screen.findByTestId("Diamonds-Jack.png")).toBeInTheDocument();

      expect(screen.getByTestId("concealed.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-5.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-5.png")).toBeInTheDocument();
      expect(screen.queryByTestId("Diamonds-4.png")).toBeNull();
      expect(await screen.findByTestId("Diamonds-4.png")).toBeInTheDocument();

      expect(screen.queryByText("Runde ist zu Ende")).toBeNull();
      expect(await screen.findByText("Runde ist zu Ende")).toBeInTheDocument();
      expect(screen.getByText("Insgesamt gewonnen:")).toBeInTheDocument();
      expect(screen.getByText("25.00 €")).toBeInTheDocument();
    });
  });
});
