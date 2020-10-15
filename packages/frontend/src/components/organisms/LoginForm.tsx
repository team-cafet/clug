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
import './forms.scss';

export const LoginForm = () => {
  const [error, setError] = useState<null | { message: string }>(null);

  const usernameInp = useRef<HTMLInputElement>(null);
  const passwordInp = useRef<HTMLInputElement>(null);

  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return <></>;
  }

  if (globalContext.state.isAuthentified) {
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

      globalContext.dispatch({ type: GlobalContextActions.HAS_LOGIN });

      // setHasLogin(true);
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
    <form onSubmit={submit} className=" form login">
      {error ? <Alert variant="danger">{error.message}</Alert> : null}
      <Input ref={usernameInp} placeholder="Nom d'utilisateur" type="text" className="input"/>
      <Input ref={passwordInp} placeholder="Mot de passe" type="password" className="input" />
      <Button type="submit" variant="secondary">Se connecter</Button>
    </form>
  );
};
