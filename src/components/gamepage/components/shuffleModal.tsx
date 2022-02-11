import React from "react";
import CenteredModal from "../../ui/modal/centeredModal";
import Button from "../../ui/button";

type shuffleModalProps = {
  show: boolean;
  onConfirmShuffle(): void;
}

function ShuffleModal({ show, onConfirmShuffle }: shuffleModalProps): JSX.Element {
  return (
    <CenteredModal
      show={show}
      onHide={onConfirmShuffle}
      title="Der Kartenstapel wird neu gemischt"
      size="auto"
      hasEdgedCorners
      hasBlackBackground
      isClosable
      footer={(
        <Button
          styleType="primary"
          onClick={onConfirmShuffle}
          size="small"
        >
          OK
        </Button>
      )}
    >
      <div />
    </CenteredModal>
  );
}

export default ShuffleModal;
