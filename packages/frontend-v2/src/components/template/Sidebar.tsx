import React from 'react';
import { Link } from 'react-router-dom';
//DOC: https://github.com/negomi/react-burger-menu
import { slide as Menu } from "react-burger-menu"; 
import './Sidebar.scss';
interface IProps {
  links: {displayName: string, to: string}[];
  pageWrapId: string;
  outerContainerId: string;
}

export const Sidebar = (props: IProps) => {

  return (
    <div id="sidebar">
    <Menu {...props} width={'40%'}>
      {props.links.map((link) => (
        <a className="menu-item" href={link.to} key={link.to}>
          {link.displayName}
        </a>
        ))}
    </Menu>
    </div>
  );
};
