import React, { useState } from "react";
import { Offcanvas, Form } from "react-bootstrap";
import HumanPlayer from "../../model/player/humanPlayer";
import Button from "../ui/button";
import SimulatorModal from "../simulator/simulatorModal";

type MenuProps = {
    show: boolean;
    handleClose(): void;
    activeProfile: HumanPlayer | undefined;
    updateActiveProfile(): void;
}

function Menu({
  show, handleClose, activeProfile, updateActiveProfile,
}: MenuProps): JSX.Element {
  const [isSimulatorModalShown, setIsSimulatorModalShown] = useState(false);

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Einstellungen</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-4">
            <h5 style={{ paddingBottom: "6px" }}>Strategie Hilfestellungen</h5>
            <Form.Check
              type="checkbox"
              label="Basic Strategie"
              checked={activeProfile?.settings.useBasicStrategy}
              onChange={() => {
                if (activeProfile) {
                  activeProfile.settings.useBasicStrategy = !activeProfile.settings.useBasicStrategy;
                  updateActiveProfile();
                }
              }}
            />
            <Form.Check
              type="checkbox"
              label="Karten Zähler"
              checked={activeProfile?.settings.useCardCounter}
              onChange={() => {
                if (activeProfile) {
                  activeProfile.settings.useCardCounter = !activeProfile.settings.useCardCounter;
                  updateActiveProfile();
                }
              }}
            />
          </div>
          {/*
          <div>
            <h5 style={{ paddingBottom: "6px" }}>Simuliere Durchlauf</h5>
            <Button
              styleType="primary"
              onClick={() => {
                setIsSimulatorModalShown(true);
                handleClose();
              }}
              size="auto"
              style={{ padding: "5px" }}
            >
              Simuliere Strategie
            </Button>
          </div>
          */}
        </Offcanvas.Body>
      </Offcanvas>
      <SimulatorModal
        show={isSimulatorModalShown}
        onHide={() => setIsSimulatorModalShown(false)}
      />
    </>
  );
}

export default Menu;
