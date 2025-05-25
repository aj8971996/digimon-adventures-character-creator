// src/app/features/digimon-character/evolution-line-selection/evolution-line-selection.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionLineSelectionComponent } from './evolution-line-selection.component';

describe('EvolutionLineSelectionComponent', () => {
  let component: EvolutionLineSelectionComponent;
  let fixture: ComponentFixture<EvolutionLineSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionLineSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionLineSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});