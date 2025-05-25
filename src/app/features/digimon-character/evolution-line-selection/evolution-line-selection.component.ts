// src/app/features/digimon-character/evolution-line-selection/evolution-line-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacterWizardService } from '../digimon-character-wizard.service';
import { AssetService } from '../../../core/services/asset.service';
import { DigimonCharacter } from '../../../core/models/digimon-character';
import { DigimonStage } from '../../../core/models/digimon-stage';
import { DIGIMON_EVOLUTION_LINES } from '../../../data/digimon-evolution-lines';

type WizardStep = 'stages' | 'rookie' | 'champion' | 'confirm';

interface EvolutionLineSelection {
  stages: DigimonStage[];
  rookieId: string;
  rookieName: string;
  rookieSprite?: string;
  championOptions: { id: string; name: string; sprite?: string }[];
  selectedChampion?: string;
  hasSplitEvolution: boolean;
}

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
  
  // Available stages for selection - ONLY Rookie and Champion for now
  availableStages = [
    DigimonStage.Rookie,
    DigimonStage.Champion
    // Disabled for now since we don't have sprites:
    // DigimonStage.Ultimate,
    // DigimonStage.Mega
  ];
  
  // Current selection state
  selectedStages: DigimonStage[] = [DigimonStage.Rookie]; // Default to Rookie
  selectedRookieId: string = '';
  selectedChampionId: string = '';
  
  // Available evolution data
  availableRookies = DIGIMON_EVOLUTION_LINES;
  availableChampions: { id: string; name: string; sprite?: string; isPrimary?: boolean }[] = [];
  
  constructor(
    private digimonService: DigimonService,
    private wizardService: DigimonCharacterWizardService,
    public assetService: AssetService
  ) {}

  ngOnInit(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
    
    // Load any existing evolution line selection
    const savedSelection = this.digimonService.getEvolutionLineSelection();
    if (savedSelection) {
      this.selectedStages = savedSelection.stages;
      this.selectedRookieId = savedSelection.rookieId;
      this.selectedChampionId = savedSelection.selectedChampion || '';
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
        return this.selectedStages.length > 0;
      case 'rookie':
        return !!this.selectedRookieId;
      case 'champion':
        return !this.stagesIncludesChampion() || !!this.selectedChampionId;
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
      // Don't allow removing Rookie as it's required
      if (stage !== DigimonStage.Rookie) {
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
    this.selectedChampionId = '';
    this.availableChampions = [];
  }

  stagesIncludesChampion(): boolean {
    return this.selectedStages.includes(DigimonStage.Champion);
  }

  // Rookie selection methods
  selectRookie(rookieId: string): void {
    this.selectedRookieId = rookieId;
    this.selectedChampionId = ''; // Reset champion selection
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

  // Champion selection methods
  selectChampion(championId: string): void {
    this.selectedChampionId = championId;
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
        return this.selectedStages.length > 0;
      case 'rookie':
        return !!this.selectedRookieId;
      case 'champion':
        return !this.stagesIncludesChampion() || !!this.selectedChampionId;
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
    // Save the evolution line selection
    const selection: EvolutionLineSelection = {
      stages: [...this.selectedStages],
      rookieId: this.selectedRookieId,
      rookieName: this.getRookieName(this.selectedRookieId),
      rookieSprite: this.getRookieSpritePath(this.selectedRookieId),
      championOptions: [...this.availableChampions],
      selectedChampion: this.selectedChampionId,
      hasSplitEvolution: this.availableChampions.length > 1
    };
    
    this.digimonService.setEvolutionLineSelection(selection);
    
    // Set up the initial Digimon based on the selection
    // Start with Rookie stage
    this.digimonService.setStage(DigimonStage.Rookie);
    
    // Determine which sprite and species to use
    let spriteToUse = '';
    let speciesToUse = '';
    
    if (this.stagesIncludesChampion() && this.selectedChampionId) {
      // If Champion is selected, use Champion sprite and name
      spriteToUse = this.getChampionSpritePath(this.selectedChampionId);
      speciesToUse = this.getChampionName(this.selectedChampionId);
    } else {
      // Otherwise use Rookie sprite and name
      spriteToUse = this.getRookieSpritePath(this.selectedRookieId);
      speciesToUse = this.getRookieName(this.selectedRookieId);
    }
    
    // Update the Digimon with basic info from the selection
    this.digimonService.updateDigimon({
      species: speciesToUse,
      profileImage: spriteToUse
    });
    
    // Proceed to the next step in the wizard
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
        return 'Choose Champion Evolution';
      case 'confirm':
        return 'Confirm Evolution Line';
      default:
        return '';
    }
  }

  getStepDescription(): string {
    switch (this.currentStep) {
      case 'stages':
        return 'Select which evolution stages you want to include in your Digimon\'s evolution line.';
      case 'rookie':
        return 'Choose the Rookie Digimon that will be the foundation of your evolution line.';
      case 'champion':
        return 'Select which Champion your Rookie will evolve into.';
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

  // Utility methods
  goBack(): void {
    this.wizardService.previousStep();
  }
}