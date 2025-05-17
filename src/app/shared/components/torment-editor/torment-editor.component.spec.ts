import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TormentEditorComponent } from './torment-editor.component';

describe('TormentEditorComponent', () => {
  let component: TormentEditorComponent;
  let fixture: ComponentFixture<TormentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TormentEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TormentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
