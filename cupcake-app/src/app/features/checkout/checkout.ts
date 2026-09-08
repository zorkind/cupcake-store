import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CartService } from '../../core/services/cart-service';
import { OrderService } from '../../core/services/order-service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  readonly completed = signal(false);
  readonly submitting = signal(false);
  readonly error = signal('');

  address = '';
  city = '';
  paymentMethod = 'pix';

  ngOnInit(): void {
    if (this.cart.items().length === 0) {
      this.router.navigateByUrl('/cart');
    }
  }

  finishOrder(): void {
    if (!this.address || !this.city) {
      this.error.set('Preencha os dados de entrega.');
      return;
    }

    if (this.cart.items().length === 0) {
      this.error.set('O carrinho está vazio.');
      return;
    }

    const order = {
      address: this.address,
      city: this.city,
      paymentMethod: this.paymentMethod,
      items: this.cart.items().map(item => ({
        productId: item.cupcake.id,
        quantity: item.quantity
      }))
    };

    this.submitting.set(true);
    this.error.set('');

    this.orderService.create(order).subscribe({
      next: () => {
        this.cart.clear();
        this.completed.set(true);
        this.submitting.set(false);
      },
      error: () => {
        this.error.set('Não foi possível finalizar o pedido.');
        this.submitting.set(false);
      }
    });
  }
}