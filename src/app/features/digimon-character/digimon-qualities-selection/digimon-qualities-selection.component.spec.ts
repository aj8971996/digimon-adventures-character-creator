import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigimonQualitiesSelectionComponent } from './digimon-qualities-selection.component';

describe('DigimonQualitiesSelectionComponent', () => {
  let component: DigimonQualitiesSelectionComponent;
  let fixture: ComponentFixture<DigimonQualitiesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigimonQualitiesSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigimonQualitiesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
