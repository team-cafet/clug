import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Logo } from '../atoms/Logo';
import LogoutIcon from '../../assets/logout.svg';
import './AdminLayout.scss';

interface IProps {
  children: any;
}

export const AdminLayout = (props: IProps) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 992px)',
  });

  const [isMenuOpen, setIsMenuOpen] = useState(isDesktopOrLaptop);

  const adminLinks = [
    {
      displayName: 'Tableau de bord',
      to: '/admin/dashboard',
    },
    {
      displayName: 'Membres',
      to: '/admin/members',
    },
    {
      displayName: 'Abonnements',
      to: '/admin/membershipPlans',
    },
    {
      displayName: 'Paiements',
      to: '/admin/payments',
    },
  ];

  return (
    <div id="adminlayout">
      <div className="navbar bg-primary d-flex justify-content-between fixed-top">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`navbar-toggler col-1 ${isMenuOpen ? 'open' : ''}`}
        >
          <div className="burger"><span></span><span></span><span></span><span></span></div>
        </button>

        <Link
          to="/admin/dashboard"
        >
          <Logo
            className="header"
          />
        </Link>

        <ul className="navbar-nav col-1 text-right">
          <li className="nav-item text-nowrap">
            <Link className="nav-link" to="/logout">
              <img
                className="logout icon"
                src={LogoutIcon}
                alt="logout"
              />
            </Link>
          </li>
        </ul>
      </div>

      <div id="main">
        <Nav
          className={`flex-column sidenav ${isMenuOpen ? 'open' : ''}`}
          id="sidenav"
        >
          {adminLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              activeStyle={{
                fontWeight: "bold",
                color: "var(--c-primary)"
              }}
              onClick={() => {
                if (!isDesktopOrLaptop) {
                  setIsMenuOpen(!isMenuOpen);
                }
              }}
            >
              {link.displayName}
            </NavLink>
          ))}
        </Nav>

        <div className="container" id="mainContent">
          {props.children}
        </div>
      </div>
    </div>
  );
};
