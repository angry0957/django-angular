import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooselawyerClientComponent } from './chooselawyer-client.component';

describe('ChooselawyerClientComponent', () => {
  let component: ChooselawyerClientComponent;
  let fixture: ComponentFixture<ChooselawyerClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooselawyerClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooselawyerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
