import React from 'react';

import './BasicLayout.scss';

interface IProps {
  children: any;
}

export const BasicLayout = (props: IProps) => {
  return (
    <div id="basiclayout">
      <div className="container">
        <div className="row">
          <div className="col main">{props.children}</div>
        </div>
      </div>
    </div>
  );
};
