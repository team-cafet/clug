import React, { ReactNode } from 'react';

interface IProps {
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary';
  className?: string;
  id?: string;
  disabled?: boolean;
  children: ReactNode;
}

export const Button = (props: IProps) => {
  const { type, variant, className, id, disabled } = props;

  return (
    <button
      type={type ? type : 'button'}
      id={id}
      className={`btn ${variant ? `btn-${variant}` : ''} ${className}`}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
};
