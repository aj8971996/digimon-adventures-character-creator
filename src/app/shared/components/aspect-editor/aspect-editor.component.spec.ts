import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectEditorComponent } from './aspect-editor.component';

describe('AspectEditorComponent', () => {
  let component: AspectEditorComponent;
  let fixture: ComponentFixture<AspectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
