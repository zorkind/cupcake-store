import { Injectable, computed, signal } from '@angular/core';
import { Cupcake } from '../models/cupcake';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'cupcake-cart';
  private readonly _items = signal<CartItem[]>(this.loadItems());

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

    this.saveItems();
  }

  remove(cupcakeId: number): void {
    this._items.update(items =>
      items.filter(item => item.cupcake.id !== cupcakeId)
    );

    this.saveItems();
  }

  clear(): void {
    this._items.set([]);
    this.saveItems();
  }

  increase(cupcakeId: number): void {
    this._items.update(items =>
      items.map(item =>
        item.cupcake.id === cupcakeId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    this.saveItems();
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

    this.saveItems();
  }

  private loadItems(): CartItem[] {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  }

  private saveItems(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this._items())
    );
  }
}