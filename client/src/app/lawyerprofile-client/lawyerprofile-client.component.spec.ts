import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerprofileClientComponent } from './lawyerprofile-client.component';

describe('LawyerprofileClientComponent', () => {
  let component: LawyerprofileClientComponent;
  let fixture: ComponentFixture<LawyerprofileClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerprofileClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerprofileClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
