import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly apiUrl = '/api/orders';

  create(order: {
    address: string;
    city: string;
    paymentMethod: string;
    items: {
      productId: number;
      quantity: number;
    }[];
  }): Observable<{ orderId: number; total: number }> {
    const token = this.auth.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<{ orderId: number; total: number }>(
      this.apiUrl,
      order,
      { headers }
    );
  }

  getAll(): Observable<{
    id: number;
    address: string;
    city: string;
    paymentMethod: string;
    total: number;
    createdAt: string;
  }[]> {
    const token = this.auth.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<{
      id: number;
      address: string;
      city: string;
      paymentMethod: string;
      total: number;
      createdAt: string;
    }[]>(
      this.apiUrl,
      { headers }
    );
  }
}