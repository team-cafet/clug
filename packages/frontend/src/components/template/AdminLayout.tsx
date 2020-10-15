import React from 'react';
import { Link } from 'react-router-dom';

import './AdminLayout.scss';
import { Sidebar } from './Sidebar';
import { Logo } from '../atoms/Logo';

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
        <div className="navbar bg-primary d-flex justify-content-between">
            <Link
              to="/admin/dashboard"
              className="navbar-brand"
            >
              <Logo className="header"/>
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
          <div className="container" id="mainContent">
                {props.children}
          </div>
      </div>
    </>
  );
};
