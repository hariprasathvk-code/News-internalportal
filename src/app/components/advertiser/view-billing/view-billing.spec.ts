import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBilling } from './view-billing';

describe('ViewBilling', () => {
  let component: ViewBilling;
  let fixture: ComponentFixture<ViewBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBilling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
