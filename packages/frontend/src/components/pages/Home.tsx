import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <>
      <h1>Bienvenue sur Clug App</h1>
      <Link to="/login">Login</Link>
    </>
  );
};
