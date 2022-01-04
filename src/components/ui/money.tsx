import React from "react";

type MoneyProps = {
    amount: number;
    className?: string
}

function Money({ amount, className = "" }: MoneyProps): JSX.Element {
  return (
    <span className={className}>{`${amount.toFixed(2)} €`}</span>
  );
}

export default Money;
