import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprofileClientComponent } from './editprofile-client.component';

describe('EditprofileClientComponent', () => {
  let component: EditprofileClientComponent;
  let fixture: ComponentFixture<EditprofileClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditprofileClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditprofileClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
