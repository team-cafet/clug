import React, { useState } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

interface IProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  id?: string;
  onYes: () => void;
  onNo: () => void;
  children: any;
  modal: {
    title: string;
    body: any;
    cancelText: string;
    acceptText: string;
  };
}

export const ButtonWithConfirmation = (props: IProps) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleYes = () => {
    handleClose();
    props.onYes();
  };

  return (
    <>
      <Button
        className={`${props.className}`}
        onClick={handleShow}
        title={props.title}
        disabled={props.disabled}
      >
        {props.children}
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.modal.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {props.modal.cancelText}
          </Button>
          <Button variant="primary" onClick={handleYes}>
            {props.modal.acceptText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
