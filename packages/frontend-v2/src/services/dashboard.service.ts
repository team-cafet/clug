import { APIResource } from './api.service';

class APIDashboard extends APIResource{
  constructor(){
    super('dashboard');
  }
}

export const dashboardService = new APIDashboard();