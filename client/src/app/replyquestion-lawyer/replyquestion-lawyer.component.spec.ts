import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyquestionLawyerComponent } from './replyquestion-lawyer.component';

describe('ReplyquestionLawyerComponent', () => {
  let component: ReplyquestionLawyerComponent;
  let fixture: ComponentFixture<ReplyquestionLawyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyquestionLawyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyquestionLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
