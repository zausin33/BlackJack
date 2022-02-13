import React from "react";
import Wrapper from "../../../ui/wrapper/wrapper";
import { BasicStrategyResult } from "../../../../model/strategy/basicStrategy";

function BasicStrategy({ basicStrategy }: {basicStrategy: BasicStrategyResult | undefined}): JSX.Element {
  return (
    <div className="small-wrapper center box-shadow">
      <div>
        <h5 style={{ fontWeight: 600 }}>Basic Strategy </h5>
        <div style={{ minHeight: "30px" }}>
          {basicStrategy}
        </div>
      </div>
    </div>
  );
}

export default BasicStrategy;
