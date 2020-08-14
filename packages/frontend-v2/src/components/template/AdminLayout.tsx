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
        <Sidebar links= {adminLinks}/>
        <div className="col-md-9 ml-sm-auto col-lg-10 main">
              {props.children}
            </div>
      </div>
    </>
  );
};
