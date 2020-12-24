import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import {ReactComponent as DeleteIcon} from '../../assets/delete.svg';

interface IProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  id?: string;
  buttontext: string;
  item: string;
  onYes: ()=>void;
}

export const PopUp = (props: IProps) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleYes= () => {
    handleClose();
    props.onYes();
  }

  return (
    <>
      <Button className="deleteItem btn-popup" onClick={handleShow}>
        <DeleteIcon title="Supprimer"/>
        {props.buttontext}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Supprimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Voulez-vous vraiment supprimer {props.item}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleYes}>
            Oui
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};