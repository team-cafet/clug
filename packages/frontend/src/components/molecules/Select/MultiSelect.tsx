import {
  FieldInputProps,
  FieldMetaProps,
  FormikBag,
} from 'formik';
import React from 'react';
import Select from 'react-select';

interface IProps {
  name: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: any;
  value: any[];
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
      onChange={props.onChange}
    />
  );
};

export const MultiSelectFormik = (props: {
  field: FieldInputProps<any>;
  form: FormikBag<any, any>;
  meta: FieldMetaProps<any>;
  options: {
    value: string;
    label: string;
  }[];
}) => (
  <MultiSelect
    {...props.field}
    options={props.options}
    onChange={(newOptions: any) =>
      props.field.onChange(
        // Needed otherwise React and Formik can't find the target
        // https://github.com/JedWatson/react-select/issues/1631#issuecomment-555986192
        {
          currentTarget: {
            value: newOptions
              ? newOptions.map((option: any) => option.value)
              : [],
            name: props.field.name,
          },
        }
      )
    }
  />
);
