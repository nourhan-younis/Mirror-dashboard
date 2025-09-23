import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDashboardLayoutComponent } from './app-dashboard-layout.component';

describe('AppDashboardLayoutComponent', () => {
  let component: AppDashboardLayoutComponent;
  let fixture: ComponentFixture<AppDashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDashboardLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
