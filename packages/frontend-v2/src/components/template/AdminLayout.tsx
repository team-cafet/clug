import React from 'react';

interface IProps {
  children: any;
}

export const AdminLayout = (props: IProps) => {
  return (
    <>
      <h2>Welcome on Admin !</h2>
      {props.children}
    </>
  );
};
