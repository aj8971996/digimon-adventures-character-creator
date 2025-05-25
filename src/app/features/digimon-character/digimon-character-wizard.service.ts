// src/app/features/digimon-character/digimon-character-wizard.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { EvolutionLineManagerService } from '../../core/services/evolution-line-manager.service';
import { DigimonService } from '../../core/services/digimon.service';
import { DigimonStage } from '../../core/models/digimon-stage';

export enum WizardStep {
  EvolutionLineSelection = 0,
  BasicInfo = 1,
  StatsAllocation = 2,
  QualitiesSelection = 3,
  AttacksConfiguration = 4,
  CharacterSummary = 5
}

@Injectable({
  providedIn: 'root'
})
export class DigimonCharacterWizardService {
  // Array of routes corresponding to each wizard step
  private readonly stepRoutes: string[] = [
    'evolution-line-selection',
    'basic-info',
    'stats-allocation',
    'qualities-selection',
    'attacks-configuration',
    'character-summary'
  ];

  // The current step in the wizard
  private currentStepSubject = new BehaviorSubject<WizardStep>(WizardStep.EvolutionLineSelection);
  public currentStep$: Observable<WizardStep> = this.currentStepSubject.asObservable();

  // Track if step validation should be skipped
  private skipValidation = false;

  constructor(
    private router: Router,
    private evolutionLineManager: EvolutionLineManagerService,
    private digimonService: DigimonService
  ) {}

  /**
   * Get the current step
   */
  getCurrentStep(): WizardStep {
    return this.currentStepSubject.getValue();
  }

  /**
   * Navigate to a specific step
   */
  goToStep(step: WizardStep): void {
    if (step >= 0 && step < Object.keys(WizardStep).length / 2) {
      this.currentStepSubject.next(step);
      this.navigateToCurrentStep();
    }
  }

  /**
   * Update the current step without triggering navigation
   */
  setStepWithoutNavigation(step: WizardStep): void {
    if (step >= 0 && step < Object.keys(WizardStep).length / 2) {
      this.currentStepSubject.next(step);
    }
  }

  /**
   * Get the step index from a route path
   */
  getStepIndexFromRoute(routePath: string): number {
    return this.stepRoutes.indexOf(routePath);
  }

  /**
   * Navigate to the next step with evolution line awareness
   */
  nextStep(): void {
    const currentStep = this.getCurrentStep();
    
    // Special handling for character completion in evolution lines
    if (currentStep === WizardStep.CharacterSummary) {
      const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
      
      if (evolutionLine && !this.evolutionLineManager.isEvolutionLineComplete()) {
        // Save current character and move to next in evolution line
        this.completeCurrentCharacterAndProceedToNext();
        return;
      }
    }
    
    const nextStep = currentStep + 1;
    
    if (nextStep < Object.keys(WizardStep).length / 2) {
      this.currentStepSubject.next(nextStep);
      this.navigateToCurrentStep();
    }
  }

  /**
   * Navigate to the previous step
   */
  previousStep(): void {
    const currentStep = this.getCurrentStep();
    const previousStep = currentStep - 1;
    
    if (previousStep >= 0) {
      this.currentStepSubject.next(previousStep);
      this.navigateToCurrentStep();
    }
  }

  /**
   * Navigate to the route corresponding to the current step
   */
  private navigateToCurrentStep(): void {
    const currentStep = this.getCurrentStep();
    const route = this.stepRoutes[currentStep];
    this.router.navigate(['/digimon-character', route]);
  }

  /**
   * Complete current character and proceed to next in evolution line
   */
  completeCurrentCharacterAndProceedToNext(): void {
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    if (!evolutionLine) return;

    // Save current character to evolution line
    const currentCharacter = this.digimonService.getCurrentDigimon();
    this.evolutionLineManager.saveCharacterForStage(
      evolutionLine.currentEditingStage,
      currentCharacter,
      evolutionLine.currentEditingEvolutionId
    );

    // Get next character to create
    const nextToCreate = this.evolutionLineManager.getNextToCreate();
    
    if (nextToCreate) {
      // Set up for next character creation
      this.evolutionLineManager.setCurrentEditing(nextToCreate.stage, nextToCreate.evolutionId);
      
      // Initialize new Digimon for the next stage
      this.initializeDigimonForStage(nextToCreate.stage, nextToCreate.evolutionId);
      
      // Go to basic info for the new character
      this.goToStep(WizardStep.BasicInfo);
    } else {
      // Evolution line is complete, stay on summary
      // The summary component will handle showing all characters
      console.log('Evolution line complete!');
    }
  }

  /**
   * Initialize a new Digimon for a specific stage and evolution
   */
  private initializeDigimonForStage(stage: DigimonStage, evolutionId?: string): void {
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    if (!evolutionLine) return;

    // Reset Digimon service for new character
    this.digimonService.setStage(stage);
    
    // Set appropriate sprite and species based on stage and evolution
    if (stage === DigimonStage.Rookie) {
      // For Rookie, use rookie sprite and name
      const rookieSprite = evolutionLine.rookieSprite 
        ? `assets/images/digimon-sprites/rookies/${evolutionLine.rookieSprite}`
        : '';
      
      this.digimonService.updateDigimon({
        species: evolutionLine.rookieName,
        profileImage: rookieSprite,
        name: '' // Clear name so user can set individual name
      });
    } else if (stage === DigimonStage.Champion && evolutionId) {
      // For Champion, use champion sprite and name
      const championOption = evolutionLine.championOptions.find(c => c.id === evolutionId);
      
      if (championOption) {
        const championSprite = championOption.sprite 
          ? `assets/images/digimon-sprites/champions/${championOption.sprite}`
          : '';
        
        this.digimonService.updateDigimon({
          species: championOption.name,
          profileImage: championSprite,
          name: '' // Clear name so user can set individual name
        });
      }
    }
  }

  /**
   * Start a new character in an existing evolution line
   */
  startNextCharacterInLine(): void {
    const nextToCreate = this.evolutionLineManager.getNextToCreate();
    
    if (nextToCreate) {
      this.evolutionLineManager.setCurrentEditing(nextToCreate.stage, nextToCreate.evolutionId);
      this.initializeDigimonForStage(nextToCreate.stage, nextToCreate.evolutionId);
      this.goToStep(WizardStep.BasicInfo);
    }
  }

  /**
   * Check if we're currently in an evolution line creation process
   */
  isInEvolutionLine(): boolean {
    return this.evolutionLineManager.getCurrentEvolutionLine() !== null;
  }

  /**
   * Get information about the current character being created in evolution line
   */
  getCurrentEvolutionContext(): {
    stage?: DigimonStage;
    evolutionId?: string;
    characterName?: string;
    isComplete: boolean;
    progress: { completed: number; total: number; percentage: number };
  } {
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    
    if (!evolutionLine) {
      return {
        isComplete: false,
        progress: { completed: 0, total: 0, percentage: 0 }
      };
    }

    const progress = this.evolutionLineManager.getCreationProgress();
    let characterName = '';

    if (evolutionLine.currentEditingStage === DigimonStage.Rookie) {
      characterName = evolutionLine.rookieName;
    } else if (evolutionLine.currentEditingStage === DigimonStage.Champion && evolutionLine.currentEditingEvolutionId) {
      const champion = evolutionLine.championOptions.find(c => c.id === evolutionLine.currentEditingEvolutionId);
      characterName = champion ? champion.name : '';
    }

    return {
      stage: evolutionLine.currentEditingStage,
      evolutionId: evolutionLine.currentEditingEvolutionId,
      characterName,
      isComplete: this.evolutionLineManager.isEvolutionLineComplete(),
      progress
    };
  }

  /**
   * Start the wizard
   */
  startWizard(): void {
    this.goToStep(WizardStep.EvolutionLineSelection);
  }

  /**
   * Reset the wizard to the first step
   */
  resetWizard(): void {
    this.evolutionLineManager.resetEvolutionLine();
    this.goToStep(WizardStep.EvolutionLineSelection);
  }

  /**
   * Check if the current step is the first step
   */
  isFirstStep(): boolean {
    return this.getCurrentStep() === 0;
  }

  /**
   * Check if the current step is the last step
   */
  isLastStep(): boolean {
    return this.getCurrentStep() === (Object.keys(WizardStep).length / 2) - 1;
  }

  /**
   * Get the total number of steps
   */
  getTotalSteps(): number {
    return Object.keys(WizardStep).length / 2;
  }

  /**
   * Temporarily skip validation
   */
  setSkipValidation(skip: boolean): void {
    this.skipValidation = skip;
  }

  /**
   * Check if validation should be skipped
   */
  shouldSkipValidation(): boolean {
    return this.skipValidation;
  }

  /**
   * Get current character context for display
   */
  getCurrentCharacterContext(): {
    isEvolutionLine: boolean;
    currentStage?: DigimonStage;
    currentEvolutionId?: string;
    progress?: { completed: number; total: number; percentage: number };
  } {
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    
    if (evolutionLine) {
      return {
        isEvolutionLine: true,
        currentStage: evolutionLine.currentEditingStage,
        currentEvolutionId: evolutionLine.currentEditingEvolutionId,
        progress: this.evolutionLineManager.getCreationProgress()
      };
    }
    
    return {
      isEvolutionLine: false
    };
  }
}