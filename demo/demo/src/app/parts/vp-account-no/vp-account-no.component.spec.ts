import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpAccountNoComponent } from './vp-account-no.component';

describe('VpAccountNoComponent', () => {
  let component: VpAccountNoComponent;
  let fixture: ComponentFixture<VpAccountNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VpAccountNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VpAccountNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
