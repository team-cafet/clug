import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLineComponent } from './member-line.component';

describe('MemberLineComponent', () => {
  let component: MemberLineComponent;
  let fixture: ComponentFixture<MemberLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
