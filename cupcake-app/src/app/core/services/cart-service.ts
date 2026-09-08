import { Injectable, computed, signal } from '@angular/core';
import { Cupcake } from '../models/cupcake';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly itemCount = computed(() =>
    this._items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce(
      (total, item) => total + item.cupcake.price * item.quantity,
      0
    )
  );

  add(cupcake: Cupcake): void {
    this._items.update(items => {
      const existing = items.find(item => item.cupcake.id === cupcake.id);

      if (existing) {
        return items.map(item =>
          item.cupcake.id === cupcake.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { cupcake, quantity: 1 }];
    });
  }

  remove(cupcakeId: number): void {
    this._items.update(items =>
      items.filter(item => item.cupcake.id !== cupcakeId)
    );
  }

  clear(): void {
    this._items.set([]);
  }

  increase(cupcakeId: number): void {
    this._items.update(items =>
      items.map(item =>
        item.cupcake.id === cupcakeId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  decrease(cupcakeId: number): void {
    this._items.update(items =>
      items
        .map(item =>
          item.cupcake.id === cupcakeId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }
}