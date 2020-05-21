import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDetailsComponent } from './club-details.component';

describe('ClubDetailsComponent', () => {
  let component: ClubDetailsComponent;
  let fixture: ComponentFixture<ClubDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
