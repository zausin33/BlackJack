import React from "react";
import { chipsFolder } from "../../utils/chipHelpers";

type chipButtonProps = {
    chip: number | string;
    onClick(event: React.MouseEvent<HTMLButtonElement>): void;
    disabled?: boolean;
}

function ChipButton({ chip, onClick, disabled = false }: chipButtonProps): JSX.Element {
  return (
    <button type="button" className="chip-button circle" onClick={onClick} disabled={disabled}>
      <img
        className={`chip-image chip-button-image ${disabled ? "chip-button-image-disabled" : ""}`}
        src={`${chipsFolder}chip-${chip}.png`}
        alt={`chip-${chip}`}
        width="70"
        height="70"
      />
    </button>
  );
}

export default ChipButton;
