import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAds } from './view-ads';

describe('ViewAds', () => {
  let component: ViewAds;
  let fixture: ComponentFixture<ViewAds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
