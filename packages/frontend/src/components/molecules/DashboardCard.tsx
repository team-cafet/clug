import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './DashboardCard.scss';

interface IProps {
  value: string;
  children: any;
  description: string;
}

export const DashboardCard = (props: IProps) => {
  const { value, children, description } = props;
  const [hideChildren, setHideChildren] = useState<boolean>(true);

  return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">{description}</p>
        <h5 className="card-title">{value}</h5>
        <Button variant="primary" type="submit" onClick={() => setHideChildren(false)}>
          Voir la liste
        </Button>
        <div hidden={hideChildren}>{children}</div>
      </div>
    </div>
  );
}; 
