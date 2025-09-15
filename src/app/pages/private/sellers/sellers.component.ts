import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { TableComponent } from '../../../components/molecules/table/table.component';
import { TableHeadCol } from '../../../interfaces/components/table';
import { DatePipe, Location, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';
import { TableBodyCellDirective } from "../../../directives/table-body-cell.directive";
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-sellers',
  imports: [ButtonComponent, TableComponent, TableBodyCellDirective, NgSwitch, NgSwitchCase, NgSwitchDefault, DatePipe, FontAwesomeModule],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.css'
})
export class SellersComponent implements OnInit {
  tableField: TableHeadCol[] = [{
    field: '_id',
    text: 'id'
  }, {
    field: 'createdAt',
    text: 'fecha de venta'
  }, {
    field: 'actions',
    text: ''
  }];
  bills: Bill[] = [];
  billTotal = 0;
  pageData = {
    page: 1,
    limit: 10,
  };
  icon = {
    eye: faEye,
  };

  constructor(
    private readonly location: Location,
    private readonly billService: BillService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.loadBill();
  }

  goBack() {
    this.location.back();
  }

  loadBill() {
    this
      .billService
      .getBills({})
      .subscribe(res => {
        this.bills = res.bills.map(item => new Bill(item));
        this.billTotal = res.total;

        if (res.message) {
          alert(res.message);
        }
      });
  }

  goToCreateBill() {
    this.router.navigate(['/seller/create']);
  }

  goToBillDetail(billId: string) {
    this.router.navigate(['/seller/', billId])
  }
}
