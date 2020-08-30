import React, { useEffect, useState } from 'react';
import { DashboardCard } from '../../molecules/DashboardCard';
import { dashboardService } from '../../../services/dashboard.service';
import { IDashboardStats } from '../../../libs/interfaces/dashboard.interface';

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

  if(!stats){
    return (<div>Loading...</div>)
  }

  return (
    <>
      <h1>Welcome on the Dashboard</h1>

      <hr />

      <div className="card-deck">
        <DashboardCard title="Anniversaire dans 7 jours">
          {stats?.birthdays.length}
        </DashboardCard>

        <DashboardCard title="Paiement">-</DashboardCard>
      </div>
    </>
  );
};
