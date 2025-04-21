import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public/login/login.component';
import { ProductsComponent } from './pages/private/products/products.component';
import { authGuard } from './guards/auth.guard';
import { Page404Component } from './pages/public/page-404/page-404.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductsComponent,
      },
    ],
    canActivateChild: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: "**",
    component: Page404Component,
  }
];
