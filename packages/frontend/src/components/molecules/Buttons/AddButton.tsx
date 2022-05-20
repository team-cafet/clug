import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export interface AddButtonProps {
  linkTo: string;
  icon?: IconProp;
  title: string;
  className?: string;
}
export function AddButton({
  linkTo,
  icon = faPlus,
  title,
  className,
}: AddButtonProps): JSX.Element {
  return (
    <Link
      to={linkTo}
      title={title}
      className={'btn btn-secondary' + className}
    >
      <Button variant="outline-primary"><FontAwesomeIcon icon={icon} /> Ajouter</Button>  
    </Link>
  );
}
