import React, { FormEvent, useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { Redirect } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';

export const ClubForm = () => {
  const [error, setError] = useState<null | { message: string }>(null);

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

      <Button type="submit">Login</Button>
    </form>
  );
};
