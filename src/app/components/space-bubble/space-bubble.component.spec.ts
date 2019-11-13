import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceBubbleComponent } from './space-bubble.component';

describe('SpaceBubbleComponent', () => {
  let component: SpaceBubbleComponent;
  let fixture: ComponentFixture<SpaceBubbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceBubbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
