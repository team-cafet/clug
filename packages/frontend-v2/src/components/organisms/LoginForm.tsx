import React, { useRef, FormEvent, useContext, useState } from 'react';
import { login } from '../../services/auth.service';
import {
  GlobalContext,
  GlobalContextActions,
} from '../../contexts/GlobalContext';
import { Redirect } from 'react-router-dom';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';

export const LoginForm = () => {
  const [hasLogin, setHasLogin] = useState(false);
  const [error, setError] = useState<null | { message: string }>(null);

  const usernameInp = useRef<HTMLInputElement>(null);
  const passwordInp = useRef<HTMLInputElement>(null);

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
      const username = usernameInp.current?.value
        ? usernameInp.current.value
        : '';
      const password = passwordInp.current?.value
        ? passwordInp.current.value
        : '';
      await login(username, password);
      globalContext.dispatch({ type: GlobalContextActions.LOAD_USER_CONFIG });
      setHasLogin(true);
    } catch (err) {
      console.error(err);
      if (err.message) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Erreur serveur...' });
      }
    }
  };

  return (
    <form onSubmit={submit}>
      {error ? <Alert>{error.message}</Alert> : null}
      <Input ref={usernameInp} placeholder="username" type="text" />
      <Input ref={passwordInp} placeholder="password" type="password" />
      <Button type="submit">Login</Button>
    </form>
  );
};
