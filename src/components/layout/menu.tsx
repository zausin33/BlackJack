import React from "react";
import { Offcanvas, Form } from "react-bootstrap";
import HumanPlayer from "../../model/player/humanPlayer";

type MenuProps = {
    show: boolean;
    handleClose(): void;
    activeProfile: HumanPlayer | undefined;
    updateActiveProfile(): void;
}

function Menu({
  show, handleClose, activeProfile, updateActiveProfile,
}: MenuProps): JSX.Element {
  return (
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
            onClick={() => {
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
            onClick={() => {
              if (activeProfile) {
                activeProfile.settings.useCardCounter = !activeProfile.settings.useCardCounter;
                updateActiveProfile();
              }
            }}
          />
        </div>
        <div>
          <h5>Simuliere Durchlauf</h5>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Menu;
