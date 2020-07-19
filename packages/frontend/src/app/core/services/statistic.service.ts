import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class StatisticService {
  API_URL = `${environment.apiUrl}statistic`;

  constructor(private readonly http: HttpClient) {}

  async get(url: string): Promise<any> {
    return this.doRequest(
      this.http.get(`${this.API_URL}${url}`).toPromise()
    );
  }

  private async doRequest(request: Promise<any>) {
    try {
      return await request;
    } catch (error) {
      console.error('ApiService:RequestError:', error);
      throw new Error('ApiService:RequestError');
    }
  }
}
