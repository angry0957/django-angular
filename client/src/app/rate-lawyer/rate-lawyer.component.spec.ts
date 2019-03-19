import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateLawyerComponent } from './rate-lawyer.component';

describe('RateLawyerComponent', () => {
  let component: RateLawyerComponent;
  let fixture: ComponentFixture<RateLawyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateLawyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
