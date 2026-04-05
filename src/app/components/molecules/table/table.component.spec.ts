import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';

interface TestRow {
  id: string;
  name: string;
}

describe('TableComponent', () => {
  let component: TableComponent<TestRow>;
  let fixture: ComponentFixture<TableComponent<TestRow>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableComponent<TestRow>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
