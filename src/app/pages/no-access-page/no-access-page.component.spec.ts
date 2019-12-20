import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccessPageComponent } from './no-access-page.component';

describe('NoAccessPageComponent', () => {
  let component: NoAccessPageComponent;
  let fixture: ComponentFixture<NoAccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoAccessPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
