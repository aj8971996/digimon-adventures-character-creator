// src/app/features/digimon-character/evolution-line-selection/evolution-line-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacterWizardService } from '../digimon-character-wizard.service';
import { EvolutionLineManagerService } from '../../../core/services/evolution-line-manager.service';
import { AssetService } from '../../../core/services/asset.service';
import { DigimonCharacter } from '../../../core/models/digimon-character';
import { DigimonStage } from '../../../core/models/digimon-stage';
import { DIGIMON_EVOLUTION_LINES } from '../../../data/digimon-evolution-lines';

type WizardStep = 'stages' | 'rookie' | 'champion' | 'confirm';

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
  
  // Available stages for selection
  availableStages = [
    DigimonStage.Rookie,
    DigimonStage.Champion
    // Ultimate and Mega disabled for now
  ];
  
  // Current selection state
  selectedStages: DigimonStage[] = [DigimonStage.Rookie]; // Default to Rookie
  selectedRookieId: string = '';
  selectedChampionIds: string[] = []; // Changed to array for multiple selection
  allowNoEvolution: boolean = false; // New option for single-stage Digimon
  
  // Available evolution data
  availableRookies = DIGIMON_EVOLUTION_LINES;
  availableChampions: { id: string; name: string; sprite?: string; isPrimary?: boolean }[] = [];
  
  constructor(
    private digimonService: DigimonService,
    private wizardService: DigimonCharacterWizardService,
    private evolutionLineManager: EvolutionLineManagerService,
    public assetService: AssetService
  ) {}

  ngOnInit(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
    
    // Load any existing evolution line selection
    const savedEvolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    if (savedEvolutionLine) {
      this.selectedStages = savedEvolutionLine.selectedStages;
      this.selectedRookieId = savedEvolutionLine.rookieId;
      this.selectedChampionIds = savedEvolutionLine.selectedChampions;
      this.updateAvailableChampions();
    }
  }

  // Step management methods
  isStepActive(step: WizardStep): boolean {
    return this.currentStep === step;
  }

  isStepCompleted(step: WizardStep): boolean {
    switch (step) {
      case 'stages':
        return this.selectedStages.length > 0 || this.allowNoEvolution;
      case 'rookie':
        return !!this.selectedRookieId;
      case 'champion':
        return !this.stagesIncludesChampion() || this.selectedChampionIds.length > 0;
      case 'confirm':
        return false; // Never completed until we proceed
      default:
        return false;
    }
  }

  // Stage selection methods
  isStageSelected(stage: DigimonStage): boolean {
    return this.selectedStages.includes(stage);
  }

  toggleStage(stage: DigimonStage): void {
    const index = this.selectedStages.indexOf(stage);
    if (index > -1) {
      // Don't allow removing Rookie as it's required (unless no evolution is allowed)
      if (stage !== DigimonStage.Rookie || this.allowNoEvolution) {
        this.selectedStages.splice(index, 1);
      }
    } else {
      this.selectedStages.push(stage);
      // Sort stages in proper order
      this.selectedStages.sort((a, b) => {
        const order = [DigimonStage.Rookie, DigimonStage.Champion, DigimonStage.Ultimate, DigimonStage.Mega];
        return order.indexOf(a) - order.indexOf(b);
      });
    }
    
    // Reset selections if stages change
    this.selectedRookieId = '';
    this.selectedChampionIds = [];
    this.availableChampions = [];
  }

  toggleNoEvolution(): void {
    this.allowNoEvolution = !this.allowNoEvolution;
    if (this.allowNoEvolution) {
      // If no evolution, only keep Rookie
      this.selectedStages = [DigimonStage.Rookie];
    }
  }

  stagesIncludesChampion(): boolean {
    return this.selectedStages.includes(DigimonStage.Champion);
  }

  // Rookie selection methods
  selectRookie(rookieId: string): void {
    this.selectedRookieId = rookieId;
    this.selectedChampionIds = []; // Reset champion selection
    this.updateAvailableChampions();
  }

  updateAvailableChampions(): void {
    const rookieData = this.availableRookies.find(r => r.rookieId === this.selectedRookieId);
    this.availableChampions = rookieData ? rookieData.championOptions : [];
  }

  getRookieName(rookieId: string): string {
    const rookie = this.availableRookies.find(r => r.rookieId === rookieId);
    return rookie ? rookie.rookieName : '';
  }

  getRookieSpritePath(rookieId: string): string {
    const rookie = this.availableRookies.find(r => r.rookieId === rookieId);
    const spriteName = rookie?.rookieSprite;
    return spriteName ? this.assetService.getRookieSpritePath(spriteName) : '';
  }

  // Champion selection methods - updated for multiple selection
  toggleChampion(championId: string): void {
    const index = this.selectedChampionIds.indexOf(championId);
    if (index > -1) {
      // Remove from selection
      this.selectedChampionIds.splice(index, 1);
    } else {
      // Add to selection
      this.selectedChampionIds.push(championId);
    }
  }

  isChampionSelected(championId: string): boolean {
    return this.selectedChampionIds.includes(championId);
  }

  getChampionName(championId: string): string {
    const champion = this.availableChampions.find(c => c.id === championId);
    return champion ? champion.name : '';
  }

  getChampionSpritePath(championId: string): string {
    const champion = this.availableChampions.find(c => c.id === championId);
    const spriteName = champion?.sprite;
    return spriteName ? this.assetService.getChampionSpritePath(spriteName) : '';
  }

  // Navigation methods
  canProceedFromCurrentStep(): boolean {
    switch (this.currentStep) {
      case 'stages':
        return this.selectedStages.length > 0 || this.allowNoEvolution;
      case 'rookie':
        return !!this.selectedRookieId;
      case 'champion':
        return !this.stagesIncludesChampion() || this.selectedChampionIds.length > 0;
      case 'confirm':
        return true;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (!this.canProceedFromCurrentStep()) return;
    
    switch (this.currentStep) {
      case 'stages':
        this.currentStep = 'rookie';
        break;
      case 'rookie':
        if (this.stagesIncludesChampion()) {
          this.currentStep = 'champion';
        } else {
          this.currentStep = 'confirm';
        }
        break;
      case 'champion':
        this.currentStep = 'confirm';
        break;
      case 'confirm':
        this.finishSelection();
        break;
    }
  }

  previousStep(): void {
    switch (this.currentStep) {
      case 'rookie':
        this.currentStep = 'stages';
        break;
      case 'champion':
        this.currentStep = 'rookie';
        break;
      case 'confirm':
        if (this.stagesIncludesChampion()) {
          this.currentStep = 'champion';
        } else {
          this.currentStep = 'rookie';
        }
        break;
    }
  }

  finishSelection(): void {
    if (this.allowNoEvolution) {
      // Create single-stage Digimon
      this.createSingleStageDigimon();
    } else {
      // Initialize evolution line
      this.initializeEvolutionLine();
    }
  }

  private createSingleStageDigimon(): void {
    // Set up the Digimon for single-stage creation
    this.digimonService.setStage(DigimonStage.Rookie);
    
    const rookieSprite = this.getRookieSpritePath(this.selectedRookieId);
    const rookieName = this.getRookieName(this.selectedRookieId);
    
    // Update the Digimon with basic info
    this.digimonService.updateDigimon({
      species: rookieName,
      profileImage: rookieSprite
    });
    
    // Proceed to basic info step
    this.wizardService.nextStep();
  }

  private initializeEvolutionLine(): void {
    // Initialize the evolution line manager
    this.evolutionLineManager.initializeEvolutionLine({
      rookieId: this.selectedRookieId,
      rookieName: this.getRookieName(this.selectedRookieId),
      rookieSprite: this.getRookieSpritePath(this.selectedRookieId),
      selectedStages: [...this.selectedStages],
      selectedChampions: [...this.selectedChampionIds],
      championOptions: [...this.availableChampions]
    });

    // Start with the first stage to create (always Rookie)
    const nextToCreate = this.evolutionLineManager.getNextToCreate();
    if (nextToCreate) {
      this.evolutionLineManager.setCurrentEditing(nextToCreate.stage, nextToCreate.evolutionId);
      
      // Set up Digimon service for the first character
      this.digimonService.setStage(nextToCreate.stage);
      
      // For Rookie, use rookie sprite and name
      if (nextToCreate.stage === DigimonStage.Rookie) {
        const rookieSprite = this.getRookieSpritePath(this.selectedRookieId);
        const rookieName = this.getRookieName(this.selectedRookieId);
        
        this.digimonService.updateDigimon({
          species: rookieName,
          profileImage: rookieSprite
        });
      }
    }
    
    // Proceed to basic info step
    this.wizardService.nextStep();
  }

  // Template helper methods
  getStepTitle(): string {
    switch (this.currentStep) {
      case 'stages':
        return 'Select Evolution Stages';
      case 'rookie':
        return 'Choose Your Rookie Digimon';
      case 'champion':
        return 'Choose Champion Evolution(s)';
      case 'confirm':
        return 'Confirm Evolution Line';
      default:
        return '';
    }
  }

  getStepDescription(): string {
    switch (this.currentStep) {
      case 'stages':
        return 'Select which evolution stages you want to include, or create a single-stage Digimon.';
      case 'rookie':
        return 'Choose the Rookie Digimon that will be the foundation of your evolution line.';
      case 'champion':
        return 'Select one or more Champions for split evolution paths. Select multiple for branching evolution.';
      case 'confirm':
        return 'Review your evolution line selection and proceed to character creation.';
      default:
        return '';
    }
  }

  // Helper methods for template display
  getRookieSprite(rookieId: string): string {
    return this.getRookieSpritePath(rookieId);
  }

  getChampionSprite(championId: string): string {
    return this.getChampionSpritePath(championId);
  }

  getSelectedChampionNames(): string[] {
    return this.selectedChampionIds.map(id => this.getChampionName(id));
  }

  isSplitEvolution(): boolean {
    return this.selectedChampionIds.length > 1;
  }

  // Utility methods
  goBack(): void {
    this.wizardService.previousStep();
  }
}