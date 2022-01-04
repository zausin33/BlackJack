import React from "react";
import Money from "../ui/money";

type MoneyAreaProps = {
    money: number;
}

function MoneyArea({ money }: MoneyAreaProps): JSX.Element {
  return (
    <div className="money-area">
      <Money amount={money} />
    </div>
  );
}

export default MoneyArea;
