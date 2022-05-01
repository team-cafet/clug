import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {} from 'react';
import { ButtonProps } from 'react-bootstrap';
import { ButtonWithConfirmation } from './ButtonWithConfirmation';

interface IProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  id?: string;
  buttontext: string;
  item: string;
  onYes: () => void;
}

export const DeleteBtnWithConfirmation = (props: IProps) => {
  const modalProps = {
    title: 'Supprimer',
    body: `Voulez-vous vraiment supprimer ${props.item}`,
    cancelText: 'Annuler',
    acceptText: 'Oui',
  };

  return (
    <ButtonWithConfirmation
      modal={modalProps}
      onYes={props.onYes}
      onNo={() => {}}
      className={`${props.className}`}
      title={props.title}
    >
      <FontAwesomeIcon icon={faTrash} />
      {props.buttontext}
    </ButtonWithConfirmation>
  );
};
