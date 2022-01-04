import React from "react";
import { Modal } from "react-bootstrap";
import "./centeredModal.css";

type CenteredModalProps = {
  show: boolean;
  onHide(): void;
  children: JSX.Element;
  footer: JSX.Element;
  title?: string;
  size: "big" | "small" | "auto";
  isClosable?: boolean;
  hasEdgedCorners?: boolean;
  hasBlackBackground?: boolean;
}

function CenteredModal({
  title = "", isClosable = true, hasEdgedCorners = false, hasBlackBackground = false, ...props
}: CenteredModalProps):
    JSX.Element {
  const {
    show, onHide, children, footer, size,
  } = props;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName={`modal ${hasEdgedCorners ? "box-shadow-edged" : "box-shadow"} content-modal-${size} ${hasBlackBackground ? "modal-background-black" : ""}`}
      backdrop={isClosable ? true : "static"}
    >
      <Modal.Header className="modal-header">
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ width: "100%" }}
        >
          <h2>{title}</h2>
        </Modal.Title>
        {isClosable && (
        <button
          type="button"
          className="close-button"
          onClick={onHide}
        >
          X
        </button>
        )}
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        {footer}
      </Modal.Footer>
    </Modal>
  );
}

export default CenteredModal;
