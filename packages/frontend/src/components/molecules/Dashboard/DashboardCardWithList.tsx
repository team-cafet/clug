import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import './DashboardCard.scss';

interface IProps {
  value: number;
  children: any;
  description: string;
}

export const DashboardCardWithSubCard = (props: IProps) => {
  const { value, children, description } = props;
  const [hideChildren, setHideChildren] = useState<boolean>(true);

  return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">{description}</p>
        <h5 className="card-title">{value}</h5>
        {value > 0 ? (
          <Button
            variant="primary"
            type="submit"
            onClick={() => setHideChildren(!hideChildren)}
          >
            {hideChildren ? 'Voir la liste' : 'Cacher la liste'}
          </Button>
        ) : (
          ''
        )}
        {!hideChildren && <Card>
          {children}
        </Card>}
      </div>
    </div>
  );
};
