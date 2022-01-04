import React from "react";
import Button from "../ui/button";

type ButtonAreaProps = {
    onHumanTakesCard(): void;
    onStand(): void;
    canPlayerDouble: boolean;
    onDoubleBet(): void;
    canPlayerSplit: boolean;
    onPlayerSplit(): void;
}

function ButtonArea({
  onHumanTakesCard, onStand, canPlayerDouble, onDoubleBet, canPlayerSplit, onPlayerSplit,
}: ButtonAreaProps): JSX.Element {
  return (
    <div className="game-board-button-area">
      <Button
        styleType="secondary"
        onClick={onHumanTakesCard}
        style={{ margin: "0 3px" }}
      >
        Noch eine Karte
      </Button>
      <Button
        styleType="secondary"
        onClick={onStand}
        style={{ margin: "0 3px" }}
      >
        Halten
      </Button>
      {canPlayerDouble && (
        <Button
          styleType="secondary"
          onClick={onDoubleBet}
          style={{ margin: "0 3px" }}
        >
          Einsatz verdoppeln
        </Button>
      )}
      {canPlayerSplit && (
        <Button
          styleType="secondary"
          onClick={onPlayerSplit}
          style={{ margin: "0 3px" }}
        >
          Splitten
        </Button>
      )}
    </div>
  );
}

export default ButtonArea;
