import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowlawyerLawyerComponent } from './showlawyer-lawyer.component';

describe('ShowlawyerLawyerComponent', () => {
  let component: ShowlawyerLawyerComponent;
  let fixture: ComponentFixture<ShowlawyerLawyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowlawyerLawyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowlawyerLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
