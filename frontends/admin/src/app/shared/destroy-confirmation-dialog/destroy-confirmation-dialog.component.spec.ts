import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroyConfirmationDialogComponent } from './destroy-confirmation-dialog.component';

describe('DestroyConfirmationDialogComponent', () => {
  let component: DestroyConfirmationDialogComponent;
  let fixture: ComponentFixture<DestroyConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestroyConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestroyConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
