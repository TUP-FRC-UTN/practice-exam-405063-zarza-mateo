import { Routes } from '@angular/router';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrdersComponent } from './components/orders/orders.component';

export const routes: Routes = [
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'orders', component: OrdersComponent },
  { path: "", redirectTo:'/create-order', pathMatch:'full' },
];
