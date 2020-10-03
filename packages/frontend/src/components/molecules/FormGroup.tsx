import React from 'react';
import { ErrorMessage, Field } from 'formik';

interface IProps {
  className?: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'password';
  formnikError: string | undefined;
  name: string;
}

export const FormGroup = ({ className, label, type, formnikError, name }: IProps) => (
  <div className={`form-group ${className}`}>
    <label>{label}</label>
    <Field
      className={`form-control ${formnikError ? 'is-invalid' : ''}`}
      name={name}
      type={type}
    />
    <ErrorMessage name={name} component="div" className="invalid-feedback" />
  </div>
);
