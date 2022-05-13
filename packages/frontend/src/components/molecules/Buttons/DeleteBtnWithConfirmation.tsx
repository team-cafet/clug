import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {} from 'react';
import { ButtonProps } from 'react-bootstrap';
import { ButtonWithConfirmation } from './ButtonWithConfirmation';

interface IProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline-primary' | 'outline-secondary';
  className?: string;
  buttontext: string;
  item: string;
  onYes: () => void;
  title?: string;
}

export default function DeleteBtnWithConfirmation({variant, className, buttontext, item, onYes, title}: IProps): JSX.Element {
  const modalProps = {
    title: 'Supprimer',
    body: `Voulez-vous vraiment supprimer ${item} ?`,
    cancelText: 'Annuler',
    acceptText: 'Oui',
  };

  return (
    <ButtonWithConfirmation
      modal={modalProps}
      onYes={onYes}
      onNo={() => {}}
      className={className}
      title={title}
      variant={variant}
    >
      <FontAwesomeIcon icon={faTrashAlt} />
      {buttontext && ' ' + buttontext}
    </ButtonWithConfirmation>
  );
};
