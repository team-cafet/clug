import React, {} from 'react';
import { ReactComponent as DeleteIcon } from '../../../assets/delete.svg';
import { ButtonWithConfirmation } from './ButtonWithConfirmation';

interface IProps {
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
    >
      <DeleteIcon title="Supprimer" />
      {props.buttontext}
    </ButtonWithConfirmation>
  );
};
