import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRadioComponent } from './table-radio.component';

describe('TableRadioComponent', () => {
  let component: TableRadioComponent;
  let fixture: ComponentFixture<TableRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRadioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
