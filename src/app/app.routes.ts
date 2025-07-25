import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public/login/login.component';
import { ProductsComponent } from './pages/private/products/products.component';
import { authGuard } from './guards/auth.guard';
import { Page404Component } from './pages/public/page-404/page-404.component';
import { CreateProductComponent } from './pages/private/create-product/create-product.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductsComponent,
      },
      {
        path: 'product',
        children: [{
          path: 'new',
          component: CreateProductComponent,
        }]
      }
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
