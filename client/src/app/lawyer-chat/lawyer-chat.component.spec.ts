import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerChatComponent } from './lawyer-chat.component';

describe('LawyerChatComponent', () => {
  let component: LawyerChatComponent;
  let fixture: ComponentFixture<LawyerChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
