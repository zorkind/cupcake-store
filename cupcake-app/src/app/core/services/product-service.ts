import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cupcake } from '../models/cupcake';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = '/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cupcake[]> {
    return this.http.get<Cupcake[]>(this.apiUrl);
  }
}