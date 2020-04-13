import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {
  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async get(url: string): Promise<any> {
    return await this.http.get(`${this.API_URL}${url}`).toPromise();
  }

  async post(url: string, body: any): Promise<any> {
    return await this.http.post(`${this.API_URL}${url}`, body).toPromise();
  }

  async delete(url: string): Promise<any> {
    return await this.http.delete(`${this.API_URL}${url}`).toPromise();
  }
}
