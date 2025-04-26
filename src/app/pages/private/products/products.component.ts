import { Component, OnInit } from '@angular/core';
import {
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  DatePipe,
} from '@angular/common';
import { TableComponent } from '../../../components/molecules/table/table.component';
import { TableHeadCol } from '../../../interfaces/components/table';
import { ProductService } from '../../../services/product.service';
import { ProductInterface } from '../../../interfaces/product';
import { TableBodyCellDirective } from '../../../directives/table-body-cell.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-products',
  imports: [
    TableComponent,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    TableBodyCellDirective,
    DatePipe,
    FontAwesomeModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  tableField: TableHeadCol[] = [
    {
      field: '_id',
      text: 'id',
    },
    {
      field: 'name',
      text: 'nombre',
    },
    {
      field: 'createdAt',
      text: 'fecha crea.',
    },
    {
      field: 'action',
      text: '',
    },
  ];
  products: ProductInterface[] = [];
  productTotal: number = 0;
  pageData = {
    page: 1,
    limit: 10,
  };

  editIcon = faEdit;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts(this.pageData).subscribe((res) => {
      this.products = res.products;
      this.productTotal = res.total;

      if (res.message) {
        alert(res.message);
      }
    });
  }
}
