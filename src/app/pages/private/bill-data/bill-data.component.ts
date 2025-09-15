import { Component, OnInit } from '@angular/core';
import { BillService } from '../../../services/bill.service';
import { ActivatedRoute } from '@angular/router';
import { Bill } from '../../../models/bill';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../../../components/atoms/button/button.component';

@Component({
  selector: 'app-bill-data',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './bill-data.component.html',
  styleUrl: './bill-data.component.css'
})
export class BillDataComponent implements OnInit {
  private billId = '';

  bill: Bill | undefined;

  constructor(
    private readonly billService: BillService,
    private readonly activatedRouter: ActivatedRoute,
    private readonly location: Location,
  ) { }

  ngOnInit(): void {
    const billId = this.activatedRouter.snapshot.paramMap.get('billId');
    this.billId = billId ?? '';

    this.loadBillDetail();
  }

  loadBillDetail() {
    this
      .billService
      .getBillDetailById(this.billId)
      .subscribe(result => {
        if (result.message) {
          alert(result.message);
        }

        if (result.bill) {
          this.bill = new Bill({
            _id: result.bill._id,
            createdAt: result.bill.createdAt,
            updatedAt: result.bill.updatedAt,
            userId: result.bill.userId
          });

          this.bill.setSales(result.bill.sales);
          this.bill.setTotal(result.bill.total);
        }
      });
  }

  handlerBack() {
    this.location.back();
  }
}
