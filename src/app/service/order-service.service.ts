import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(`${this.apiUrl}/products`);
  }

  getOrders() {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getOrdersByEmail(email: string) {
    return this.http.get(`${this.apiUrl}/orders?email=${email}`);
  }

  createOrder(order: any) {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }
}
