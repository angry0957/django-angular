import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerReviewsComponent } from './lawyer-reviews.component';

describe('LawyerReviewsComponent', () => {
  let component: LawyerReviewsComponent;
  let fixture: ComponentFixture<LawyerReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
