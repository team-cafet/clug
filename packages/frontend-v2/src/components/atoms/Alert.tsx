import React, { ReactNode } from 'react';

interface IProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  id?: string;
  children: ReactNode;
}

export const Alert = (props: IProps) => {
  const { variant, className, id } = props;

  return (
    <div
      id={id}
      className={`alert ${variant ? `alert-${variant}` : ''} ${className}`}
    >
      {props.children}
    </div>
  );
};
