import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MksInfoComponent } from './mks-info.component';

describe('MksInfoComponent', () => {
  let component: MksInfoComponent;
  let fixture: ComponentFixture<MksInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MksInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MksInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
