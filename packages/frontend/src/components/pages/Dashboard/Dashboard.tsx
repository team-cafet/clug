import React, { useEffect, useState } from 'react';
import { DashboardCard } from '../../molecules/DashboardCard';
import { dashboardService } from '../../../services/dashboard.service';
import { IDashboardStats } from '../../../libs/interfaces/dashboard.interface';
import { Link } from 'react-router-dom';
import { IMember } from '../../../libs/interfaces/member.interface';

export const Dashboard = () => {
  const [stats, setStats] = useState<IDashboardStats | null>(null);

  useEffect(() => {
    const request = async () => {
      const result = await dashboardService.getAll();
      if (result) {
        setStats(result.data);
      }
    };

    request();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Tableau de bord</h1>
      <div className="card-deck">
        <DashboardCard
          value={stats.birthdays.length}
          description={"Membres ayant leur anniversaire dans 7 jours"}
        >
          <ul className="list-group">
            {stats.birthdays.map((member: IMember) => (
              <li className="list-group-item">
                <Link to={`/admin/members/${member.id}`}>
                  {member.user?.firstname} {member.user?.lastname}
                </Link>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard
          value={stats.negativeBalanceUsers.length}
          description={"Membres ayant leur anniversaire dans 7 jours"}
        >
          <ul className="list-group">
            {stats.negativeBalanceUsers.map((member: IMember) => (
              <li className="list-group-item">
                <Link to={`/admin/members/${member.id}`}>
                  {member.user?.firstname} {member.user?.lastname}
                </Link>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </>
  );
};
