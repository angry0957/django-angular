import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprofileLawyerComponent } from './editprofile-lawyer.component';

describe('EditprofileLawyerComponent', () => {
  let component: EditprofileLawyerComponent;
  let fixture: ComponentFixture<EditprofileLawyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditprofileLawyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditprofileLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
