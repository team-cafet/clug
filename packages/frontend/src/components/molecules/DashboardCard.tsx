import React from 'react';
import './DashboardCard.scss';

interface IProps {
  value: number;
  children: any;
  description: string;
}

export const DashboardCard = (props: IProps) => {
  const { value, children, description } = props;

  return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">{description}</p>
        <h5 className="card-title">{value}</h5>
        <div>{children}</div>
      </div>
    </div>
  );
}; 
