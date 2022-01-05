import React from "react";
import Button from "../ui/button";

type ButtonAreaProps = {
    onHumanTakesCard(): void;
    onStand(): void;
    canPlayerDouble: boolean;
    onDoubleBet(): void;
    canPlayerSplit: boolean;
    onPlayerSplit(): void;
    disabled: boolean
}

function ButtonArea({
  onHumanTakesCard, onStand, canPlayerDouble, onDoubleBet, canPlayerSplit, onPlayerSplit, disabled,
}: ButtonAreaProps): JSX.Element {
  return (
    <div className="game-board-button-area">
      <Button
        styleType="secondary"
        onClick={onHumanTakesCard}
        style={{ margin: "0 3px" }}
        disabled={disabled}
      >
        Noch eine Karte
      </Button>
      <Button
        styleType="secondary"
        onClick={onStand}
        style={{ margin: "0 3px" }}
        disabled={disabled}
      >
        Halten
      </Button>
      {canPlayerDouble && (
        <Button
          styleType="secondary"
          onClick={onDoubleBet}
          style={{ margin: "0 3px" }}
          disabled={disabled}
        >
          Einsatz verdoppeln
        </Button>
      )}
      {canPlayerSplit && (
        <Button
          styleType="secondary"
          onClick={onPlayerSplit}
          style={{ margin: "0 3px" }}
          disabled={disabled}
        >
          Splitten
        </Button>
      )}
    </div>
  );
}

export default ButtonArea;
