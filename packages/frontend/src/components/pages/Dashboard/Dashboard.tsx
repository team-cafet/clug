import React, { useEffect, useState } from 'react';
import { DashboardCard } from '../../molecules/Dashboard/DashboardCard';
import { DashboardCardWithSubCard } from '../../molecules/Dashboard/DashboardCardWithList';
import { dashboardService } from '../../../services/dashboard.service';
import { IDashboardStats } from '../../../libs/interfaces/dashboard.interface';
import { Link } from 'react-router-dom';
import { IMember } from '../../../libs/interfaces/member.interface';
import { Button, CardColumns } from 'react-bootstrap';

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
      <CardColumns>
        <DashboardCard
          value={stats.totalMembers.length}
          description={'Nombre total de membres'}
        >
          <Button variant="primary" as={Link} to={`/admin/members`}>Voir la liste</Button>         
        </DashboardCard>

        <DashboardCardWithSubCard
          value={stats.birthdays.length}
          description={'Membres ayant leur anniversaire bientôt'}
        >
          <ul className="list-group">
            {stats.birthdays.map((member: IMember) => (
              <li className="list-group-item" key={member.id}>
                {member.user?.firstname} {member.user?.lastname} : 
                {member?.user?.birthdate
                  ? new Date(member.user.birthdate)
                      .toLocaleDateString('FR-fr')
                  : ''}
              </li>
            ))}
          </ul>
        </DashboardCardWithSubCard>

        <DashboardCard
          value={stats.negativeBalanceUsers.length}
          description={'Membres devant renouveler leur abonnement'}
        >
          <Button variant="primary" as={Link} to={`/admin/payments`}>Voir la liste</Button>          
        </DashboardCard>
      </CardColumns>
    </>
  );
};
