import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { productComponent } from '../models/product';
import { orderClass } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderServiceService {
 
  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:3000';

  constructor() {}

  getProducts(): Observable<productComponent[]> {
    const observable = this.http.get<productComponent[]>(
      this.url + '/products'
    );
    return observable;
  }

  postOrder(order: any): Observable<any> {
    const observable = this.http.post<any>(this.url + '/orders', order);
    return observable;
  }

  getOrders(): Observable<orderClass[]> {
    const observable = this.http.get<any>(this.url + '/orders');
    return observable;
  }

  getOrdersByEmail(email: string): Observable<orderClass[]> {
    const observable = this.http.get<any>(this.url + '/orders?email=' + email);
    return observable;
  }
}
