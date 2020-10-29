import React from 'react';
import { Link, useHistory } from 'react-router-dom';

export const Home = () => {
  const history = useHistory();
  history.push('/login');
  //Until this page is designed to welcome prospect or client, redirect straight to login page.
  return (
    <>
      <h1>Bienvenue sur Clug App</h1>
      <Link to="/login">Login</Link>
    </>
  );
};
