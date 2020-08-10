import React, { forwardRef } from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, IProps>(
  (props: IProps, ref) => {
    const { id, className, type, placeholder } = props;

    return (
      <input
        ref={ref}
        id={id}
        className={`form-control ${className}`}
        type={type ? `${type}` : 'text'}
        placeholder={placeholder}
      />
    );
  }
);
