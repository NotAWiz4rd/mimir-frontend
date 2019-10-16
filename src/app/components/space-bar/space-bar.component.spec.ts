import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceBarComponent } from './space-bar.component';

describe('SpaceBarComponent', () => {
  let component: SpaceBarComponent;
  let fixture: ComponentFixture<SpaceBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
