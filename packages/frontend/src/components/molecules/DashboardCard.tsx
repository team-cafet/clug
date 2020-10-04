import React from 'react';

interface IProps {
  title: string;
  children: any;
}

export const DashboardCard = (props: IProps) => {
  const { title, children } = props;

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div>{children}</div>
      </div>
    </div>
  );
};
