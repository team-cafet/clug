import React from 'react';
import LogoImg from '../../assets/logo/clug-logo-w.svg';

interface IProps {
    className?: string;
  }

export const Logo = (props: IProps) => {
  const { className } = props;
  return (
    <>
        <img  
            className={`logo ${className}`}
            src={LogoImg} 
            alt="Clug logo"/>
    </>
  );
};
