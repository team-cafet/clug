import React from 'react';
import { Link } from 'react-router-dom';
interface IProps {
  links: {displayName: string, to: string}[];
}

export const Sidebar = (props: IProps) => {

  return (
    <div>
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
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-2 d-md-block sidebar collapse">
              <ul id="sidebarMenu" className="nav flex-column">
                {props.links.map((link) => (
                  <li className="nav-item" key={link.to}>
                    <Link to={link.to} className="nav-link">
                      {link.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
};
