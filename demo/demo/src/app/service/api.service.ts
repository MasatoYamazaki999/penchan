import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  async fetch(): Promise<any> {
    const res = await fetch('http://localhost:3000/msg/get');
    const result = await res.json();
    return result;
  }
}
