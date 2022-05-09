import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    //Until this page is designed to welcome prospect or client, redirect straight to login page.
    navigate('/login');
  }, [navigate])

  return (
    <>
      <h1>Bienvenue sur Clug App</h1>
      <Link to="/login">Login</Link>
    </>
  );
};
