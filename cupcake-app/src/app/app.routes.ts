import { Routes } from '@angular/router';
import { Catalog } from './features/catalog/catalog';
import { Cart } from './features/cart/cart';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Catalog },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./features/orders/orders').then(m => m.Orders) }
];