import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import { Home } from '../components/pages/Home';
import { Login } from '../components/pages/Login';
import { Logout } from '../components/pages/Logout';

it('Login renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Login /></MemoryRouter>, div);
});

it('Home renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Home /></MemoryRouter>, div);
});

it('Logout renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Logout /></MemoryRouter>, div);
});
