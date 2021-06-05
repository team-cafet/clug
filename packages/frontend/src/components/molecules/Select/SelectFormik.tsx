import { FieldInputProps, FieldMetaProps, FormikBag } from 'formik';
import React from 'react';
import Select from 'react-select';

interface IProps {
  name: string;
  value: any;
  options: {
    value: string;
    label: string;
  }[];
}
//Use Custom in class name to prevent ambuguity with native Select component
export const SelectFormik = (props: IProps) => {
  console.log(props)
  const selectedValue = props.value

  return (
    <Select
      isMulti={false}
      closeMenuOnSelect={true}
      value={selectedValue}
      options={props.options}
    />
  );
};
