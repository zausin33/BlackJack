import React from "react";

type ButtonProps = {
  children: string;
  styleType: "primary" | "secondary";
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  size?: "big" | "small";
  disabled?: boolean;
  style?: object;
  className?: string;
}

function Button({
  size = "big", disabled = false, style = {}, className = "", ...props
}: ButtonProps): JSX.Element {
  const {
    children, styleType, onClick,
  } = props;

  return (
    <button
      type="button"
      className={`btn btn-${styleType} btn-${styleType}-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
