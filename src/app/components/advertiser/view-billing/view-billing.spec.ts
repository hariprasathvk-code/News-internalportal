import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdBillingListComponent } from './view-billing';

describe('AdBillingListComponent', () => {
  let component: AdBillingListComponent;
  let fixture: ComponentFixture<AdBillingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdBillingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdBillingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
