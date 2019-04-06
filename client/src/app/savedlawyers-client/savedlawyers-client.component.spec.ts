import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedlawyersClientComponent } from './savedlawyers-client.component';

describe('SavedlawyersClientComponent', () => {
  let component: SavedlawyersClientComponent;
  let fixture: ComponentFixture<SavedlawyersClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedlawyersClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedlawyersClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
