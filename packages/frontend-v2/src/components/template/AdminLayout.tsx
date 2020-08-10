import React from 'react';
import { Link } from 'react-router-dom';

import './AdminLayout.scss';

interface IProps {
  children: any;
}

export const AdminLayout = (props: IProps) => {
  const adminLinks = [
    {
      displayName: 'Dashboard',
      to: '/admin/dashboard',
    },
    {
      displayName: 'Members',
      to: '/admin/members',
    },
    {
      displayName: 'Clubs',
      to: '/admin/clubs',
    },
  ];

  return (
    <>
      <div id="adminlayout">
        <div className="navbar navbar-dark bg-primary">
          <Link to="/admin/dashboard" className="navbar-brand">
            Clug
          </Link>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 d-none d-md-block">
              <ul className="nav flex-column">
                {adminLinks.map((link) => (
                  <li className="nav-item" key={link.to}>
                    <Link to={link.to} className="nav-link">
                      {link.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col main">{props.children}</div>
          </div>
        </div>
      </div>
    </>
  );
};
