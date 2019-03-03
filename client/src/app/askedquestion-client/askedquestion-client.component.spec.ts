import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskedquestionClientComponent } from './askedquestion-client.component';

describe('AskedquestionClientComponent', () => {
  let component: AskedquestionClientComponent;
  let fixture: ComponentFixture<AskedquestionClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskedquestionClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskedquestionClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
