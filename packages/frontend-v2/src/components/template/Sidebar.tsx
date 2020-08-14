import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
//DOC: https://github.com/negomi/react-burger-menu
import { slide as Menu } from "react-burger-menu"; 
import './Sidebar.scss';
interface IProps {
  links: {displayName: string, to: string}[];
  pageWrapId: string;
  outerContainerId: string;
}

export const Sidebar = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false) //close sidebar when we change the route
  }, [location]);

  const handleStateChange = (state: any) => {
    setIsOpen(state.isOpen)  
  }

  return (
    <div id="sidebar">
    <Menu {...props} width={'40%'} isOpen={isOpen} onStateChange={(state) => handleStateChange(state)} disableAutoFocus >
      {props.links.map((link) => (
        <Link className="menu-item" to={link.to} key={link.to}>
          {link.displayName}
        </Link>
        ))}
    </Menu>
    </div>
  );
};
