import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order-service';
import { DatePipe } from '@angular/common';

interface Order {
  id: number;
  address: string;
  city: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
}

@Component({
  selector: 'app-orders',
  imports: [DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.orderService.getAll().subscribe({
      next: orders => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os pedidos.');
        this.loading.set(false);
      }
    });
  }
}