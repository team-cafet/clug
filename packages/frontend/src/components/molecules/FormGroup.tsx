import React from 'react';
import { ErrorMessage, Field, useFormik, useFormikContext } from 'formik';

interface IProps {
  className?: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'password';
  formnikError: string | undefined;
  name: string;
}

export const FormGroup = ({ className, label, type, formnikError, name }: IProps) => {
  const formnik = useFormikContext();
  const {name: inputName, value: inputValue} = {...formnik.getFieldProps(name)}
  
  return (
  <div className={`form-group ${className}`}>
    <label>{label}</label>
    <Field
      className={`form-control ${formnikError ? 'is-invalid' : ''}`}
      type={type}
      name={inputName}
      value={inputValue || ''}
    />
    <ErrorMessage name={name} component="div" className="invalid-feedback" />
  </div>
);
}