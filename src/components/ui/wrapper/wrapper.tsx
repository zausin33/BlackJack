import React from "react";
import "./wrapper.css";

type WrapperProps = {
  children: JSX.Element;
}

function Wrapper(props: WrapperProps): JSX.Element {
  const { children } = props;

  return (
    <div className="wrapper center box-shadow">
      {children}
    </div>
  );
}

export default Wrapper;
