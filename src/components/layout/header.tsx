import React from "react";
import HumanPlayer from "../../model/player/HumanPlayer";
import Money from "../ui/money";

type HeaderProps = {
    activeProfile: HumanPlayer | undefined;
}

function Header({ activeProfile }: HeaderProps): JSX.Element {
  return (
    <header style={{ position: "relative" }}>
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
          <div style={{ fontSize: "30px" }}>{activeProfile.getName()}</div>
          <div style={{ fontSize: "25px", lineHeight: "0.7" }}>
            <Money amount={activeProfile.getMoney()} />
          </div>
        </div>
      </div>
      )}
    </header>
  );
}

export default Header;
