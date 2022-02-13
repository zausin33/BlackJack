import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import AppRouter from "../../appRouter";
import { mockUser, setupCardStack } from "../testSetup";
import Card from "../../model/card/card";
import CardColor from "../../model/card/cardColor";
import CardNumber from "../../model/card/cardNumber";

describe("Test basic game functions", () => {
  beforeEach(() => {
    mockUser();
    setupCardStack([
      new Card(10010, CardColor.HEARTS, CardNumber.QUEEN, true),
      new Card(10010, CardColor.HEARTS, CardNumber.SEVEN, true),
      new Card(10010, CardColor.HEARTS, CardNumber.JACK, true),
      new Card(10010, CardColor.HEARTS, CardNumber.KING, true),
    ]);
    window.history.pushState({}, "Test page", "/blackjack");
    render(<AppRouter />, { wrapper: BrowserRouter });
  });

  test("bet more than half your money and win", async () => {
    userEvent.click(screen.getByTestId("chip-1000"));
    userEvent.click(screen.getByTestId("chip-500"));
    expect(screen.getByText("1500.00 €")).toBeInTheDocument();
    userEvent.click(screen.getByText("OK"));
    userEvent.click(screen.getByText("Halten"));
    expect(await screen.findByTestId("Hearts-King.png"));
    expect(await screen.findByText("Gewonnen"));
    expect(screen.getByText("3000.00 €"));
  });
});
