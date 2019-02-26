import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupLawyerComponent } from './signup-lawyer.component';

describe('SignupLawyerComponent', () => {
  let component: SignupLawyerComponent;
  let fixture: ComponentFixture<SignupLawyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupLawyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
