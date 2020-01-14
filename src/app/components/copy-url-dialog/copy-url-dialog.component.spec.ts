import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyUrlDialogComponent } from './copy-url-dialog.component';

describe('CopyUrlDialogComponent', () => {
  let component: CopyUrlDialogComponent;
  let fixture: ComponentFixture<CopyUrlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyUrlDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
