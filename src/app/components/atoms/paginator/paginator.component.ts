import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from '@fortawesome/free-regular-svg-icons';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-paginator',
  imports: [NgFor, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent implements OnInit {
  @Input({ required: true }) total: number = 0;
  @Input() currentPage: number = 1;
  @Input() limitOptions: number[] = new Array(10)
    .fill(null)
    .map((_a, i) => (i + 1) * 10);
  @Input() currentLimit = new FormControl<number>(10, Validators.required);
  @Output() pageEvent = new EventEmitter<number>();
  @Output() limitEvent = new EventEmitter<number>();

  totalPages = 1;

  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faArrowAltCircleRight = faArrowAltCircleRight;

  ngOnInit(): void {
    this.currentLimit.setValue(this.limitOptions[0]);

    if (!this.total || !this.currentLimit.value) {
      this.totalPages = 1;
    } else {
      this.totalPages = Math.ceil(this.total / this.currentLimit.value);
    }

    this.currentLimit.valueChanges.pipe(
      map((newValue) => this.limitEvent.next(newValue || 1))
    );
  }

  handleChangePage(num: number) {
    console.log(num);

    if (this.currentPage + num < 1) {
      return;
    }

    this.currentPage += num;
    this.pageEvent.next(this.currentPage);
  }
}
