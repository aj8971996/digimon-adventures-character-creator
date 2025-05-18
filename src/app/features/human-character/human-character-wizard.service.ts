import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export enum WizardStep {
  CampaignSelection = 0,
  CharacterBasics = 1,
  AttributesAllocation = 2,
  SkillsAllocation = 3,
  SpecialOrders = 4,
  Aspects = 5,
  Torments = 6,
  DerivedStats = 7,
  CharacterSummary = 8
}

@Injectable({
  providedIn: 'root'
})
export class HumanCharacterWizardService {
  // Array of routes corresponding to each wizard step
  private readonly stepRoutes: string[] = [
    'campaign-selection',
    'character-basics',
    'attributes-allocation',
    'skills-allocation',
    'special-orders',
    'aspects',
    'torments',
    'derived-stats',
    'character-summary'
  ];

  // The current step in the wizard
  private currentStepSubject = new BehaviorSubject<WizardStep>(WizardStep.CampaignSelection);
  public currentStep$: Observable<WizardStep> = this.currentStepSubject.asObservable();

  // Track if step validation should be skipped (e.g., when resuming a saved character)
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
    // Ensure the step is within bounds
    if (step >= 0 && step < Object.keys(WizardStep).length / 2) {
      this.currentStepSubject.next(step);
      this.navigateToCurrentStep();
    }
  }

  /**
   * Update the current step without triggering navigation
   * Useful when the route has already changed
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
    this.router.navigate(['/human-character', route]);
  }

  /**
   * Start the wizard
   */
  startWizard(): void {
    this.goToStep(WizardStep.CampaignSelection);
  }

  /**
   * Reset the wizard to the first step
   */
  resetWizard(): void {
    this.goToStep(WizardStep.CampaignSelection);
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
   * Temporarily skip validation (used when loading a saved character)
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