import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpTitleComponent } from './vp-title.component';

describe('VpTitleComponent', () => {
  let component: VpTitleComponent;
  let fixture: ComponentFixture<VpTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VpTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VpTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
