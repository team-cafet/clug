import React from 'react';
import { Link } from 'react-router-dom';

import './AdminLayout.scss';

interface IProps {
  children: any;
}

export const AdminLayout = (props: IProps) => {
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
  ];

  return (
    <>
      <div id="adminlayout">
        <div className="navbar navbar-dark bg-primary flex-md-nowrap p-0">
          <Link
            to="/admin/dashboard"
            className="navbar-brand col-md-3 col-lg-2 mr-0 px-3"
          >
            Clug
          </Link>

          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <Link className="nav-link" to="/login">
                Sign out
              </Link>
            </li>
          </ul>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-2 d-md-block sidebar collapse">
              <ul id="sidebarMenu" className="nav flex-column">
                {adminLinks.map((link) => (
                  <li className="nav-item" key={link.to}>
                    <Link to={link.to} className="nav-link">
                      {link.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-9 ml-sm-auto col-lg-10 main">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
