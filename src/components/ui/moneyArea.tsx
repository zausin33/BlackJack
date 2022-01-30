import React, { useEffect, useState } from "react";
import Money from "./money";
import { DELAY } from "../../model/blackjackGameConstants";
import calculateChips, { chipsFolder } from "../../utils/chipHelpers";

type MoneyAreaProps = {
    money: number;
    className?: string;
    doRenderWithDelay?: boolean;
}

function MoneyArea({
  money, className = "",
  doRenderWithDelay = false,
}: MoneyAreaProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(!doRenderWithDelay);
  const [chips, setChips] = useState<{ [index: string]: number}>({});

  useEffect(() => {
    if (doRenderWithDelay) {
      setTimeout(() => {
        setIsVisible(true);
      }, DELAY);
    }
  }, []);

  useEffect(() => setChips(calculateChips(money)), [money]);

  if (isVisible) {
    return (
      <div className={className}>
        {Object.keys(chips).slice().reverse().map((chip, idx) => (
          Array(chips[chip]).fill(null).map((_, i) => (
            <img
              className="chip-image"
              src={`${chipsFolder}chip-${chip}.png`}
              alt={`chip-${chip}`}
              width="50"
              height="50"
                  /* eslint-disable-next-line react/no-array-index-key */
              key={`${idx}_${chip}`}
              style={i > 0 ? { marginLeft: "-33px" } : {}}
            />
          ))
        ))}
      </div>
    );
  }
  return (
    <>
    </>
  );
}

export default MoneyArea;
