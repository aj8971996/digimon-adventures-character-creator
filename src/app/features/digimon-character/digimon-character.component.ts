// src/app/features/digimon-character/digimon-character.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { DigimonCharacterWizardService, WizardStep } from './digimon-character-wizard.service';
import { DigimonService } from '../../core/services/digimon.service';
import { EvolutionLineManagerService } from '../../core/services/evolution-line-manager.service';
import { DigimonCharacter } from '../../core/models/digimon-character';

@Component({
  selector: 'app-digimon-character',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './digimon-character.component.html',
  styleUrls: ['./digimon-character.component.scss']
})

export class DigimonCharacterComponent implements OnInit, OnDestroy {
  currentStep: WizardStep = WizardStep.EvolutionLineSelection;
  wizardSteps: { title: string, description: string }[] = [
    { title: 'Evolution Line', description: 'Select evolution path' },
    { title: 'Basic Info', description: 'Define your Digimon' },
    { title: 'Stats', description: 'Allocate stat points' },
    { title: 'Qualities', description: 'Select special abilities' },
    { title: 'Attacks', description: 'Configure attack moves' },
    { title: 'Summary', description: 'Complete character' }
  ];
  
  digimon: DigimonCharacter | null = null;
  characterContext: any = { isEvolutionLine: false };
  private subscription: Subscription = new Subscription();
  
  constructor(
    private wizardService: DigimonCharacterWizardService,
    private digimonService: DigimonService,
    private evolutionLineManager: EvolutionLineManagerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    // Subscribe to wizard step changes
    this.subscription.add(
      this.wizardService.currentStep$.subscribe(step => {
        this.currentStep = step;
      })
    );
    
    // Subscribe to digimon changes
    this.subscription.add(
      this.digimonService.digimon$.subscribe(digimon => {
        this.digimon = digimon;
      })
    );

    // Subscribe to evolution line changes
    this.subscription.add(
      this.evolutionLineManager.evolutionLine$.subscribe(evolutionLine => {
        this.updateCharacterContext();
      })
    );
    
    // Add listener for route changes to update step indicator accordingly
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const currentRoute = this.router.url.split('/').pop();
        if (currentRoute) {
          const stepIndex = this.wizardService.getStepIndexFromRoute(currentRoute);
          if (stepIndex >= 0 && stepIndex !== this.currentStep) {
            this.wizardService.setStepWithoutNavigation(stepIndex);
            this.currentStep = stepIndex;
          }
        }
      })
    );
    
    // Load saved digimon and evolution line if exists
    const hasSavedDigimon = this.digimonService.loadDigimon();
    const hasSavedEvolutionLine = this.evolutionLineManager.loadFromStorage();
    
    // Update character context
    this.updateCharacterContext();
    
    // Start the wizard
    this.wizardService.startWizard();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Update the character context based on current evolution line state
   */
  private updateCharacterContext(): void {
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    
    if (evolutionLine) {
      const progress = this.evolutionLineManager.getCreationProgress();
      const currentCharacterName = this.getCurrentCharacterName(evolutionLine);
      
      this.characterContext = {
        isEvolutionLine: true,
        currentStage: evolutionLine.currentEditingStage,
        currentEvolutionId: evolutionLine.currentEditingEvolutionId,
        currentCharacterName: currentCharacterName,
        progress: progress,
        rookieName: evolutionLine.rookieName,
        isComplete: this.evolutionLineManager.isEvolutionLineComplete()
      };
    } else {
      this.characterContext = {
        isEvolutionLine: false
      };
    }
  }

  /**
   * Get the name of the current character being created
   */
  private getCurrentCharacterName(evolutionLine: any): string {
    if (evolutionLine.currentEditingStage === 'Rookie') {
      return evolutionLine.rookieName;
    } else if (evolutionLine.currentEditingStage === 'Champion' && evolutionLine.currentEditingEvolutionId) {
      const champion = evolutionLine.championOptions.find((c: any) => c.id === evolutionLine.currentEditingEvolutionId);
      return champion ? champion.name : 'Unknown Champion';
    }
    return 'Unknown';
  }
  
  // Navigate directly to a step (if allowed)
  goToStep(stepIndex: number): void {
    if (this.canProceedToStep(stepIndex)) {
      this.wizardService.goToStep(stepIndex);
    } else {
      alert('Please complete the current step before proceeding.');
    }
  }
  
  // Helper method to check if user can proceed to the given step
  canProceedToStep(stepIndex: number): boolean {
    // If going backward, always allow
    if (stepIndex < this.currentStep) {
      return true;
    }
    
    // If skipping steps, don't allow
    if (stepIndex > this.currentStep + 1) {
      return false;
    }
    
    return this.isCurrentStepValid();
  }
  
  // Check if the current step's data is valid
  isCurrentStepValid(): boolean {
    return true; // For now, allow navigation
  }
  
  // Helper methods for templates
  isStepComplete(stepIndex: number): boolean {
    if (stepIndex === 0) return true;
    return stepIndex <= this.currentStep;
  }
  
  isStepActive(stepIndex: number): boolean {
    return stepIndex === this.currentStep;
  }
  
  // Reset the wizard and start over
  resetWizard(): void {
    const confirmMessage = this.characterContext.isEvolutionLine 
      ? 'Are you sure you want to reset your evolution line creation progress? All unsaved changes will be lost.'
      : 'Are you sure you want to reset your Digimon creation progress? All unsaved changes will be lost.';
      
    if (confirm(confirmMessage)) {
      this.digimonService.resetDigimon();
      this.evolutionLineManager.resetEvolutionLine();
      this.wizardService.resetWizard();
    }
  }
  
  // Save current progress
  saveProgress(): void {
    this.digimonService.saveDigimon();
    
    // Also save evolution line progress if applicable
    if (this.characterContext.isEvolutionLine) {
      const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
      if (evolutionLine) {
        // Save current character to evolution line
        const currentDigimon = this.digimonService.getCurrentDigimon();
        this.evolutionLineManager.saveCharacterForStage(
          evolutionLine.currentEditingStage,
          currentDigimon,
          evolutionLine.currentEditingEvolutionId
        );
      }
    }
    
    alert('Progress saved successfully!');
  }

  /**
   * Get the display text for what's currently being created
   */
  getCurrentCreationText(): string {
    if (!this.characterContext.isEvolutionLine) {
      return 'Single Digimon';
    }

    if (this.characterContext.isComplete) {
      return 'Evolution Line Complete';
    }

    const characterName = this.characterContext.currentCharacterName || 'Unknown';
    const stage = this.characterContext.currentStage || 'Unknown';
    
    return `${characterName} (${stage})`;
  }
}