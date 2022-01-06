import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/button";
import Wrapper from "../ui/wrapper/wrapper";
import HumanPlayer from "../../model/player/HumanPlayer";

type ButtonAreaProps = {
  setIsProfileModalShown(value: boolean): void;
  onResetAccount(): void;
  getActiveProfile(): HumanPlayer | undefined;
}

function ButtonArea(props: ButtonAreaProps): JSX.Element {
  const navigate = useNavigate();
  const { setIsProfileModalShown, onResetAccount, getActiveProfile } = props;

  const isPlayerMoneyEqualStartMoney = getActiveProfile()?.money === HumanPlayer.START_MONEY;

  return (
    <Wrapper>
      <div
        className="center justify-content-evenly"
        style={{ height: "75%" }}
      >
        <Button
          styleType="primary"
          onClick={() => navigate("/blackjack")}
        >
          Neues Spiel
        </Button>
        <Button
          styleType="primary"
          onClick={() => onResetAccount()}
          disabled={isPlayerMoneyEqualStartMoney}
        >
          Konto zurücksetzen
        </Button>
        <Button
          styleType="primary"
          onClick={() => setIsProfileModalShown(true)}
        >
          Profil wechseln
        </Button>
      </div>
    </Wrapper>
  );
}

export default ButtonArea;
