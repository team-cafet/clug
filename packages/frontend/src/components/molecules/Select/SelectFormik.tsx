import React, { Props } from 'react';
import Select from 'react-select';

interface IProps {
  field: {
    name: string;
    value: any;
    onChange: any;
  };
  options: {
    value: number;
    label: string;
  }[];
}
export const SelectFormik = (props: IProps) => {
  console.log(props)
  let selectedValue =
    props.field.value &&
    props.options.filter((option) => option.value === props.field.value)[0];

  const patchedOnChange = (option: any) => {
    props.field.onChange({
      currentTarget: { value: option.value, name: props.field.name },
    });
  };

  return (
    <Select
      isMulti={false}
      closeMenuOnSelect={true}
      value={selectedValue}
      options={props.options}
      onChange={patchedOnChange}
    />
  );
};
