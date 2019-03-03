import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindlawyerClientComponent } from './findlawyer-client.component';

describe('FindlawyerClientComponent', () => {
  let component: FindlawyerClientComponent;
  let fixture: ComponentFixture<FindlawyerClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindlawyerClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindlawyerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
