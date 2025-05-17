import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigimonCharacterFormComponent } from './digimon-character-form.component';

describe('DigimonCharacterFormComponent', () => {
  let component: DigimonCharacterFormComponent;
  let fixture: ComponentFixture<DigimonCharacterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigimonCharacterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigimonCharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
