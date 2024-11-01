import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CreateOrderComponent } from './components/create-order/create-order.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CreateOrderComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'practice-exam';
}
