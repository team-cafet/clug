import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {
  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async get(url: string): Promise<any> {
    return await this.doRequest(
      this.http.get(`${this.API_URL}${url}`).toPromise()
    );
  }

  async post(url: string, body: any): Promise<any> {
    return await this.doRequest(
      this.http.post(`${this.API_URL}${url}`, body).toPromise()
    );
  }

  private async doRequest(request: Promise<any>) {
    try {
      return await request;
    } catch (error) {
      console.error(error);
    }
  }
}
