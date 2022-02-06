import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "../appRouter";
import { mockUser } from "./testSetup";

describe("Test App rendering on basic routes", () => {
  test("test index route", () => {
    render(<AppRouter />, { wrapper: BrowserRouter });
    expect(screen.getByText("Neues Profil erstellen")).toBeInTheDocument();
  });
  test("test error route", () => {
    window.history.pushState({}, "Error Page", "/sfd");
    render(<AppRouter />, { wrapper: BrowserRouter });
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
  });
  test("test blackjack route no user", () => {
    window.history.pushState({}, "", "/blackjack");
    render(<AppRouter />, { wrapper: BrowserRouter });
    expect(screen.getByText("Neues Profil erstellen")).toBeInTheDocument();
  });
  test("test blackjack route with user", () => {
    mockUser();
    window.history.pushState({}, "Test page", "/blackjack");
    render(<AppRouter />, { wrapper: BrowserRouter });
    expect(screen.getByText("Noch eine Karte")).toBeInTheDocument();
  });
});
