import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Logo } from '../atoms/Logo';
import '../atoms/Burger.scss';


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
      displayName: 'Clubs',
      to: '/admin/clubs',
    },
    {
      displayName: 'Abonnements',
      to: '/admin/membershipPlans',
    },
    {
      displayName: 'Paiements',
      to: '/admin/payments',
    },
    {
      displayName: 'Tag de membre',
      to: '/admin/memberlabels',
    },
  ];

  return (
    <>
      <div id="adminlayout">
      <div className="navbar bg-primary d-flex justify-content-between fixed-top">     
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`navbar-toggler col-1 ${isMenuOpen ? 'open' : '' }`}
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

          <ul className="navbar-nav col-1">
            <li className="nav-item text-nowrap">
              <Link className="nav-link" to="/logout">
                Déconnexion
              </Link>
            </li>
          </ul>
        </div>

        <div id="main">
          <Nav
            className={`flex-column sidenav ${isMenuOpen ? 'open' : '' }`}
            id="sidenav"
          >
            {adminLinks.map((link, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={link.to}
                onClick={() => {
                  if (!isDesktopOrLaptop) {
                    setIsMenuOpen(!isMenuOpen);
                  }
                }}
              >
                {link.displayName}
              </Nav.Link>
            ))}
          </Nav>

          <div className="container" id="mainContent">
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
};
