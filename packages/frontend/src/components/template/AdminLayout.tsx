import React, { useRef, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

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
        <div className="navbar navbar-dark bg-primary d-flex p-0">
          <div className="d-flex p-1 w-50">
            <Button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <span aria-label="button" role="img">
                {!isMenuOpen ? '⬛' : '✖'}
              </span>
            </Button>

            <Link
              to="/admin/dashboard"
              className="navbar-brand col-md-3 col-lg-2 mr-0 px-3"
            >
              Clug
            </Link>
          </div>

          <ul className="navbar-nav p-1">
            <li className="nav-item text-nowrap">
              <Link className="nav-link" to="/logout">
                Déconnexion
              </Link>
            </li>
          </ul>
        </div>

        <div id="main">
          <Nav
            className={`flex-column ${isMenuOpen ? 'open' : null}`}
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
