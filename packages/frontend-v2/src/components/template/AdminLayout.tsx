import React from 'react';
import { Link } from 'react-router-dom';

import './AdminLayout.scss';
import { Sidebar } from './Sidebar';

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
              <Link className="nav-link" to="/logout">
                Déconnexion
              </Link>
            </li>
          </ul>
      </div>
        <Sidebar links= {adminLinks} pageWrapId={"mainContent"} outerContainerId={"adminLayout"}/>
        <div className="col-md-9 ml-sm-auto col-lg-10 main" id="mainContent">
              {props.children}
            </div>
      </div>
    </>
  );
};
