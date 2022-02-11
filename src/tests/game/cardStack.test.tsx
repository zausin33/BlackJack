import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import React from "react";
import AppRouter from "../../appRouter";
import { mockUser, setupCardStack } from "../testSetup";
import CardStack from "../../model/card/cardStack";

describe("Test card stack", () => {
  beforeEach(() => {
    mockUser();
    window.history.pushState({}, "Test page", "/blackjack");
    render(<AppRouter />, { wrapper: BrowserRouter });
  });

  test("cards stack shuffles, when 2/3 of the cards are played", () => {
    const cardStackSpy = jest.spyOn(CardStack.prototype, "numberCardsFullStack").mockImplementation(() => {
      if (initialCards.length) return initialCards.shift()!;
      return CardStack.prototype.shift();
    });
  });
});
