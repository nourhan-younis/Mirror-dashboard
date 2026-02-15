import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortifilioComponent } from './portifilio.component';

describe('PortifilioComponent', () => {
  let component: PortifilioComponent;
  let fixture: ComponentFixture<PortifilioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortifilioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortifilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
