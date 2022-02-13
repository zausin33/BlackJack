import React, { useState } from "react";
import HumanPlayer from "../../model/player/humanPlayer";
import Money from "../ui/money";
import Button from "../ui/button";
import Menu from "./menu";

type HeaderProps = {
    activeProfile: HumanPlayer | undefined;
    updateActiveProfile(): void;
}

function Header({ activeProfile, updateActiveProfile }: HeaderProps): JSX.Element {
  const [isMenuShown, setIsMenuShown] = useState(false);

  return (
    <header style={{ position: "relative" }}>
      <div id="menu-btn-wrapper">
        <Button
          styleType="primary"
          onClick={() => setIsMenuShown(!isMenuShown)}
          className="menu-btn"
          size="auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </Button>
      </div>
      <div id="end-game-btn-wrapper" />
      <h1>Blackjack</h1>
      {!!activeProfile && (
      <div style={{
        position: "absolute",
        right: "30px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      >
        <div style={{ marginRight: "20px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fillRule="evenodd"
              /* eslint-disable-next-line max-len */
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "30px" }}>{activeProfile.name}</div>
          <div style={{ fontSize: "25px", lineHeight: "0.7" }}>
            <Money amount={activeProfile.money} />
          </div>
        </div>
      </div>
      )}
      <Menu
        show={isMenuShown}
        handleClose={() => setIsMenuShown(false)}
        activeProfile={activeProfile}
        updateActiveProfile={updateActiveProfile}
      />
    </header>
  );
}

export default Header;
