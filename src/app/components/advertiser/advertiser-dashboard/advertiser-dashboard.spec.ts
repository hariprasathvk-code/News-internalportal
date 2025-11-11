import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserDashboard } from './advertiser-dashboard';

describe('AdvertiserDashboard', () => {
  let component: AdvertiserDashboard;
  let fixture: ComponentFixture<AdvertiserDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertiserDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertiserDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
