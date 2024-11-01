import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { routes } from '../app.routes';
import { OrdersComponent } from '../components/orders/orders.component';
import { CreateOrderComponent } from '../components/create-order/create-order.component';


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
