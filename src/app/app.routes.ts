import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public/login/login.component';
import { ProductsComponent } from './pages/private/products/products.component';
import { authGuard } from './guards/auth.guard';
import { Page404Component } from './pages/public/page-404/page-404.component';
import { CreateProductComponent } from './pages/private/create-product/create-product.component';
import { ProductDataComponent } from './pages/private/product-data/product-data.component';
import { SellersComponent } from './pages/private/sellers/sellers.component';
import { CreateBillComponent } from './pages/private/create-bill/create-bill.component';
import { BillDataComponent } from './pages/private/bill-data/bill-data.component';

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
        }, {
          path: ':productId',
          component: ProductDataComponent,
        }]
      },
      {
        path: 'seller',
        children: [{
          path: '',
          component: SellersComponent,
        }, {
          path: 'create',
          component: CreateBillComponent,
        }, {
          path: ':billId',
          component: BillDataComponent,
        }],
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
