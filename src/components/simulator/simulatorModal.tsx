import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import CenteredModal from "../ui/modal/centeredModal";
import Button from "../ui/button";
import HumanPlayer from "../../model/player/humanPlayer";
import Money from "../ui/money";
import Simulator from "../../model/simulator/simulator";

type SimulatorModalProps = {
    show: boolean;
    onHide(): void;
}

function SimulatorModal(props: SimulatorModalProps): JSX.Element {
  const {
    show, onHide,
  } = props;

  const [numberGames, setNumberGames] = useState(0);
  const [initialRoundBet, setInitialRoundBet] = useState(0);
  const [withCardCounter, setWithCardCounter] = useState(false);
  const [simulatorPlayer, setSimulatorPlayer] = useState<HumanPlayer>();
  const numberGamesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      numberGamesInputRef?.current?.focus();
    }, 200);
  }, [show]);

  const doSimulate = (): void => {
    const simulator = new Simulator();
    setSimulatorPlayer(simulator.doSimulate(numberGames, initialRoundBet, withCardCounter));
  };

  return (
    <CenteredModal
      show={show}
      onHide={onHide}
      title="Strategie Simulator"
      size="auto"
      isClosable
      footer={(
        <Button
          styleType="primary"
          onClick={doSimulate}
          size="small"
          disabled={!numberGames}
        >
          Simulation Starten
        </Button>
            )}
    >
      <div style={{ width: "90%", margin: "auto" }}>
        <div>
          <label htmlFor="numberGames" style={{ display: "block" }}>
            Anzahl zu simulierender Durchläufe:
          </label>
          <input
            type="number"
            name="numberGames"
            className="form-control"
            autoComplete="off"
            value={numberGames}
            ref={numberGamesInputRef}
            onChange={(event) => {
              setNumberGames(parseFloat(event.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor="initialRoundBet" style={{ display: "block" }}>
            Grundlegender Rundeneinsatz:
          </label>
          <input
            type="number"
            name="initialRoundBet"
            className="form-control"
            autoComplete="off"
            value={initialRoundBet}
            ref={numberGamesInputRef}
            onChange={(event) => {
              setInitialRoundBet(parseFloat(event.target.value));
            }}
          />
        </div>
        <div>
          <Form.Check
            type="checkbox"
            label="Mit Kartenzählen (Grundeinsatz wird jede Runde entsprechend angepasst)"
            checked={withCardCounter}
            onChange={() => {
              setWithCardCounter(!withCardCounter);
            }}
          />
        </div>
        <div style={{ paddingTop: "15px" }}>
          {"Startkapital: "}
          <Money amount={HumanPlayer.START_MONEY} />
        </div>
        <div>
          {simulatorPlayer && (
          <>
            <h6>Result:</h6>
            <div>
              Geld:
              {" "}
              <Money amount={simulatorPlayer.money} />
            </div>
            <div>
              Gewinnspanne:
              {" "}
              {simulatorPlayer.money / HumanPlayer.START_MONEY}
            </div>
          </>
          )}

        </div>
      </div>

    </CenteredModal>
  );
}

export default SimulatorModal;
