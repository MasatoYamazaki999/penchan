import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAnchorComponent } from './base-anchor.component';

describe('BaseAnchorComponent', () => {
  let component: BaseAnchorComponent;
  let fixture: ComponentFixture<BaseAnchorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseAnchorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAnchorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
