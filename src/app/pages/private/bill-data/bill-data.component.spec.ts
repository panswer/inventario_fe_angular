import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDataComponent } from './bill-data.component';

describe('BillDataComponent', () => {
  let component: BillDataComponent;
  let fixture: ComponentFixture<BillDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
