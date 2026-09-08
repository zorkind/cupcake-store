import { Component, inject, OnInit, signal } from '@angular/core';
import { Cupcake } from '../../core/models/cupcake';
import { CartService } from '../../core/services/cart-service';
import { ProductService } from '../../core/services/product-service';

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class Catalog implements OnInit {
  cupcakes = signal<Cupcake[]>([]);

  constructor(
    readonly cartService: CartService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
  this.productService.getAll().subscribe({
    next: cupcakes => this.cupcakes.set(cupcakes),
    error: error => console.error('Erro ao carregar produtos:', error)
  });
}
}
