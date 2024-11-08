import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderServiceService } from '../../service/order-service.service';
import { orderClass } from '../../models/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {

  orders: orderClass[] = [];
  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl(''),
  });
  filteredOrders: orderClass[] = [];  
  
  constructor(private service: OrderServiceService) {}

  ngOnInit(): void {
    this.service.getOrders().subscribe((orders: orderClass[]) => {
      this.orders = orders;
      console.log(orders);
    });

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(''),
    });

    this.searchForm.get('searchTerm')?.valueChanges.subscribe(term => {
      this.filterOrders(term);
    });
  };  

  filterOrders(searchTerm: string) {
    if (!searchTerm) {
      this.filteredOrders = this.orders;
    } else {
      searchTerm = searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm) ||
          order.email.toLowerCase().includes(searchTerm)
      );
    }
  }
}
