import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public/login/login.component';
import { SignupComponent } from './pages/public/signup/signup.component';
import { ResetPasswordComponent } from './pages/public/reset-password/reset-password.component';
import { ProductsComponent } from './pages/private/products/products.component';
import { authGuard } from './guards/auth.guard';
import { Page404Component } from './pages/public/page-404/page-404.component';
import { CreateProductComponent } from './pages/private/create-product/create-product.component';
import { ProductDataComponent } from './pages/private/product-data/product-data.component';
import { SellersComponent } from './pages/private/sellers/sellers.component';
import { CreateBillComponent } from './pages/private/create-bill/create-bill.component';
import { BillDataComponent } from './pages/private/bill-data/bill-data.component';
import { StocksComponent } from './pages/private/stocks/stocks.component';
import { StockDataComponent } from './pages/private/stock-data/stock-data.component';
import { ReportsComponent } from './pages/private/reports/reports.component';
import { UsersComponent } from './pages/private/users/users.component';
import { WarehousesComponent } from './pages/private/warehouses/warehouses.component';
import { WarehouseFormComponent } from './pages/private/warehouse-form/warehouse-form.component';
import { TransferComponent } from './pages/private/transfer/transfer.component';
import { AddStockComponent } from './pages/private/add-stock/add-stock.component';

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
        children: [
          {
            path: 'new',
            component: CreateProductComponent,
          },
          {
            path: ':productId',
            component: ProductDataComponent,
          },
        ],
      },
      {
        path: 'stock',
        children: [{
          path: '',
          component: StocksComponent,
        }, {
          path: 'add',
          component: AddStockComponent,
        }, {
          path: ':stockId',
          component: StockDataComponent,
        }],
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
      }, {
        path: 'report',
        component: ReportsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'warehouses',
        children: [
          {
            path: '',
            component: WarehousesComponent,
          },
          {
            path: 'new',
            component: WarehouseFormComponent,
          },
          {
            path: ':warehouseId',
            component: WarehouseFormComponent,
          },
        ],
      },
      {
        path: 'transfer',
        component: TransferComponent,
      },
    ],
    canActivateChild: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: "**",
    component: Page404Component,
  }
];
