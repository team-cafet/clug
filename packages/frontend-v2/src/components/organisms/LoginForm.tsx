import React, { useRef, FormEvent, useContext, useState } from 'react';
import { login } from '../../services/auth.service';
import {
  GlobalContext,
  GlobalContextActions,
} from '../../contexts/GlobalContext';
import { Redirect } from 'react-router-dom';

export const LoginForm = () => {
  const [hasLogin, setHasLogin] = useState(false);

  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return <></>;
  }

  if (hasLogin || globalContext.state.userConfig) {
    return <Redirect to="/admin/dashboard" />;
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(username.current?.value, password.current?.value);
      globalContext.dispatch({ type: GlobalContextActions.LOAD_USER_CONFIG });
      setHasLogin(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={submit}>
      <input ref={username} placeholder="username" type="text" />
      <input ref={password} placeholder="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
};
