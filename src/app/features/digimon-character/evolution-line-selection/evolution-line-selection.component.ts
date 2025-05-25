// src/app/features/digimon-character/evolution-line-selection/evolution-line-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacterWizardService } from '../digimon-character-wizard.service';
import { DigimonCharacter } from '../../../core/models/digimon-character';
import { DigimonStage } from '../../../core/models/digimon-stage';

interface Champion {
  id: string;
  name: string;
  stage: DigimonStage;
}

type WizardStep = 'stages' | 'split' | 'rookie' | 'champion';

@Component({
  selector: 'app-evolution-line-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evolution-line-selection.component.html',
  styleUrl: './evolution-line-selection.component.scss'
})
export class EvolutionLineSelectionComponent implements OnInit {
  digimon: DigimonCharacter | null = null;
  currentStep: WizardStep = 'stages';
  selectedStages: DigimonStage[] = [];
  availableChampions: Champion[] = [
    { id: 'agumon', name: 'Agumon', stage: DigimonStage.Rookie },
    { id: 'gabumon', name: 'Gabumon', stage: DigimonStage.Rookie },
    { id: 'greymon', name: 'Greymon', stage: DigimonStage.Champion },
    { id: 'garurumon', name: 'Garurumon', stage: DigimonStage.Champion }
  ];
  championId: string = '';

  constructor(
    private digimonService: DigimonService,
    private wizardService: DigimonCharacterWizardService
  ) {}

  ngOnInit(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
  }

  // Method to check if current step is active
  isStepActive(step: WizardStep): boolean {
    return this.currentStep === step;
  }

  // Method to check if step is completed
  isStepCompleted(step: WizardStep): boolean {
    const stepOrder: WizardStep[] = ['stages', 'split', 'rookie', 'champion'];
    const currentIndex = stepOrder.indexOf(this.currentStep);
    const stepIndex = stepOrder.indexOf(step);
    return stepIndex < currentIndex;
  }

  // Method to check if stages includes Champion
  stagesIncludesChampion(): boolean {
    return this.selectedStages.includes(DigimonStage.Champion);
  }

  // Method to get champion name by ID
  getChampionName(id: string): string {
    const champion = this.availableChampions.find(c => c.id === id);
    return champion ? champion.name : '';
  }

  // Method to check if can proceed
  canProceed(): boolean {
    switch (this.currentStep) {
      case 'stages':
        return this.selectedStages.length > 0;
      case 'split':
        return true; // Can always proceed from split step
      case 'rookie':
        return true; // Add your logic here
      case 'champion':
        return !!this.championId;
      default:
        return false;
    }
  }

  // Navigation methods
  goBack(): void {
    this.wizardService.previousStep();
  }

  proceed(): void {
    if (this.canProceed()) {
      this.wizardService.nextStep();
    }
  }

  // Add other methods as needed for your component logic
  nextStep(): void {
    const stepOrder: WizardStep[] = ['stages', 'split', 'rookie', 'champion'];
    const currentIndex = stepOrder.indexOf(this.currentStep);
    if (currentIndex < stepOrder.length - 1) {
      this.currentStep = stepOrder[currentIndex + 1];
    }
  }

  previousStepInternal(): void {
    const stepOrder: WizardStep[] = ['stages', 'split', 'rookie', 'champion'];
    const currentIndex = stepOrder.indexOf(this.currentStep);
    if (currentIndex > 0) {
      this.currentStep = stepOrder[currentIndex - 1];
    }
  }
}