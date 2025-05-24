// src/app/features/digimon-character/digimon-character-wizard.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export enum WizardStep {
  BasicInfo = 0,
  StatsAllocation = 1,
  QualitiesSelection = 2,
  AttacksConfiguration = 3,
  CharacterSummary = 4
}

@Injectable({
  providedIn: 'root'
})
export class DigimonCharacterWizardService {
  // Array of routes corresponding to each wizard step
  private readonly stepRoutes: string[] = [
    'basic-info',
    'stats-allocation',
    'qualities-selection',
    'attacks-configuration',
    'character-summary'
  ];

  // The current step in the wizard
  private currentStepSubject = new BehaviorSubject<WizardStep>(WizardStep.BasicInfo);
  public currentStep$: Observable<WizardStep> = this.currentStepSubject.asObservable();

  // Track if step validation should be skipped
  private skipValidation = false;

  constructor(private router: Router) {}

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
   * Navigate to the next step
   */
  nextStep(): void {
    const currentStep = this.getCurrentStep();
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
   * Start the wizard
   */
  startWizard(): void {
    this.goToStep(WizardStep.BasicInfo);
  }

  /**
   * Reset the wizard to the first step
   */
  resetWizard(): void {
    this.goToStep(WizardStep.BasicInfo);
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
}