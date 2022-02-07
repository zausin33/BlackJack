import React from "react";
import CenteredModal from "../ui/modal/centeredModal";
import Button from "../ui/button";

type NewProfileModalProps = {
  show: boolean;
  onCancel(): void;
  onConfirm(): void
}

function ConfirmResetModal(props: NewProfileModalProps): JSX.Element {
  const {
    show, onCancel, onConfirm,
  } = props;

  return (
    <CenteredModal
      show={show}
      onHide={onCancel}
      title="Möchtest du wirklich dein Konto zurücksetzen?"
      size="small"
      isClosable
      footer={(
        <>
          <Button
            styleType="primary"
            onClick={onCancel}
            size="small"
          >
            Abbrechen
          </Button>
          <Button
            styleType="primary"
            onClick={onConfirm}
            size="small"
          >
            Bestätigen
          </Button>
        </>
      )}
    >
      <div style={{ width: "90%", margin: "auto" }}>
        Dein Geld wird auf dein Startkapital zurückgesetzt und deine Anzahl an gespielten Spielen wird auf 0 gesetzt.
      </div>

    </CenteredModal>
  );
}

export default ConfirmResetModal;
