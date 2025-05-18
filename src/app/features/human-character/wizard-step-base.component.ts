import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HumanCharacterWizardService } from './human-character-wizard.service';
import { CharacterService } from '../../core/services/character.service';

/**
 * Base class for all wizard step components
 * Provides common functionality for step validation and navigation
 */
@Directive()
export abstract class WizardStepComponent implements OnInit, OnDestroy {
  protected wizardService = inject(HumanCharacterWizardService);
  protected characterService = inject(CharacterService);
  
  protected subscription = new Subscription();
  protected formValid = false;
  
  ngOnInit(): void {
    // Override in child components
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  /**
   * Check if the form is valid
   * Should be implemented by each step component
   */
  abstract isFormValid(): boolean;
  
  /**
   * Update form validation status
   */
  protected updateFormValidation(): void {
    this.formValid = this.isFormValid();
  }
  
  /**
   * Save data from this step
   * Should be implemented by each step component
   */
  abstract saveData(): void;
  
  /**
   * Load data for this step from the character service
   * Should be implemented by each step component
   */
  abstract loadData(): void;
  
  /**
   * Get the zero-based index of this step in the wizard
   * Should be implemented by each step component
   */
  abstract getStepIndex(): number;
  
  /**
   * NOTE: We no longer need separate next/previous navigation
   * methods in the step components since navigation is now 
   * handled by the parent wizard component
   */
}