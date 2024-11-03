import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { productComponent } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:3000';

  constructor() { }

  getProducts(): Observable<productComponent[]> {
    const observable = this.http.get<productComponent[]>(this.url+'/products');
    return observable;
  }


  }
