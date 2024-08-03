import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpTextComponent } from './vp-text.component';

describe('VpTextComponent', () => {
  let component: VpTextComponent;
  let fixture: ComponentFixture<VpTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VpTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VpTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
