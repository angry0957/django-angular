import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorseattorneyComponent } from './endorseattorney.component';

describe('EndorseattorneyComponent', () => {
  let component: EndorseattorneyComponent;
  let fixture: ComponentFixture<EndorseattorneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndorseattorneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorseattorneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
