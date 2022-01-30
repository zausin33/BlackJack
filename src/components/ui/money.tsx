import React from "react";

type MoneyProps = {
    amount: number;
    className?: string
}

function Money({ amount, className = "" }: MoneyProps): JSX.Element {
  return (
    <span className={className}>{`${amount} €`}</span>
  );
}

export default Money;
