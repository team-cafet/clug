import React from 'react';

interface IProps {
  children: any;
}

export const BasicLayout = (props: IProps) => {
  return <>{props.children}</>;
};
