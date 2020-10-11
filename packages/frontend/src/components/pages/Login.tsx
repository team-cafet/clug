import { LoginForm } from '../organisms/LoginForm';
import React from 'react';
import Logo from '../../assets/logo/clug-logo-w.svg';
import '../atoms/logo.scss';

export const Login = () => {
  return (
    <>
      <img src={Logo} alt="Clug logo" className="login-logo"/>
      <LoginForm />
    </>
  );
};
