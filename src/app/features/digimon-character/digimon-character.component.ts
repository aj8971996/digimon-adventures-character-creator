// src/app/features/digimon-character/digimon-character.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { DigimonCharacterWizardService, WizardStep } from './digimon-character-wizard.service';
import { DigimonService } from '../../core/services/digimon.service';
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
  private subscription: Subscription = new Subscription();
  
  constructor(
    private wizardService: DigimonCharacterWizardService,
    private digimonService: DigimonService,
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
    const hasSavedEvolutionLine = this.digimonService.loadEvolutionLineSelection();
    
    // Start the wizard
    this.wizardService.startWizard();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    if (confirm('Are you sure you want to reset your Digimon creation progress? All unsaved changes will be lost.')) {
      this.digimonService.resetDigimon();
      this.wizardService.resetWizard();
    }
  }
  
  // Save current progress
  saveProgress(): void {
    this.digimonService.saveDigimon();
    alert('Digimon saved successfully!');
  }
}