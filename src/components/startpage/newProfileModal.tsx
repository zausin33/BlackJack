import React, { useEffect, useRef, useState } from "react";
import CenteredModal from "../ui/modal/centeredModal";
import Button from "../ui/button";
import HumanPlayer from "../../model/player/HumanPlayer";
import Money from "../ui/money";

type NewProfileModalProps = {
  show: boolean;
  onHide(): void;
  onCancel(): void;
  someProfileExists: boolean;
  onProfileCreate(newProfile: HumanPlayer): void
}

function NewProfileModal(props: NewProfileModalProps): JSX.Element {
  const {
    show, onHide, onCancel, someProfileExists, onProfileCreate,
  } = props;

  const [newProfileName, setNewProfileName] = useState("");
  const userNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      userNameInputRef?.current?.focus();
    }, 200);
  }, [show]);

  const createNewProfile = (): void => {
    const newProfile = new HumanPlayer(newProfileName);
    setNewProfileName("");
    newProfile.setActive(true);
    onProfileCreate(newProfile);
    onHide();
  };

  return (
    <CenteredModal
      show={show}
      onHide={onCancel}
      title="Neues Profil erstellen"
      size="small"
      isClosable={someProfileExists}
      footer={(
        <>
          {someProfileExists && (
          <Button
            styleType="primary"
            onClick={onCancel}
            size="small"
          >
            Abbrechen
          </Button>
          )}
          <Button
            styleType="primary"
            onClick={createNewProfile}
            size="small"
            disabled={!newProfileName}
          >
            Profil erstellen
          </Button>
        </>
      )}
    >
      <div style={{ width: "50%", margin: "auto" }}>
        <label htmlFor="name" style={{ display: "block" }}>Name:</label>
        <input
          type="text"
          name="name"
          className="form-control"
          autoComplete="off"
          value={newProfileName}
          ref={userNameInputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !!newProfileName) {
              createNewProfile();
            }
          }}
          onChange={(event) => {
            setNewProfileName(event.target.value);
          }}
        />
        <div style={{ paddingTop: "15px" }}>
          {"Startkapital: "}
          <Money amount={HumanPlayer.START_MONEY} />
        </div>
      </div>

    </CenteredModal>
  );
}

export default NewProfileModal;
