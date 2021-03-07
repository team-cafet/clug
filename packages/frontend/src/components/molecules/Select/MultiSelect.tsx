import React, { useState } from 'react';
import Select from 'react-select';

interface IProps {
  name: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: any;
  onBlur: any;
  value: any[];
  className: string;
}

export const MultiSelect = (props: IProps) => {

  const selectedValue =
    props.value &&
    props.options.filter((option) => props.value.includes(option.value));


  return (
    <Select
      isMulti={true}
      closeMenuOnSelect={false}
      options={props.options}
      value={selectedValue}
      onChange={(newOptions)=>props.onChange(
        // https://github.com/JedWatson/react-select/issues/1631#issuecomment-555986192
        { currentTarget: { 
          value: newOptions ? newOptions.map(option=>option.value) : [],           
          name: props.name }}
      )}
    />
  );
};
