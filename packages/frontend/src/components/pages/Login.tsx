import { LoginForm } from '../organisms/LoginForm';
import React from 'react';
import '../atoms/logo.scss';
import { Logo } from '../atoms/Logo';

export const Login = () => {
  return (
    <>
      <Logo className="login"/>
      <LoginForm />
    </>
  );
};
