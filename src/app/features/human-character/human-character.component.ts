import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { HumanCharacterWizardService, WizardStep } from './human-character-wizard.service';
import { CharacterService } from '../../core/services/character.service';
import { HumanCharacter } from '../../core/models/human-character';

@Component({
  selector: 'app-human-character',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './human-character.component.html',
  styleUrl: './human-character.component.scss'
})
export class HumanCharacterComponent implements OnInit, OnDestroy {
  currentStep: WizardStep = WizardStep.CampaignSelection;
  wizardSteps: { title: string, description: string }[] = [
    { title: 'Campaign', description: 'Choose campaign type' },
    { title: 'Basics', description: 'Character details' },
    { title: 'Attributes', description: 'Allocate attribute points' },
    { title: 'Skills', description: 'Allocate skill points' },
    { title: 'Special Orders', description: 'Select special orders' },
    { title: 'Aspects', description: 'Define character aspects' },
    { title: 'Torments', description: 'Add character torments' },
    { title: 'Derived Stats', description: 'Review calculated stats' },
    { title: 'Summary', description: 'Complete character' }
  ];
  
  character: HumanCharacter | null = null;
  private subscription: Subscription = new Subscription();
  
  constructor(
    private wizardService: HumanCharacterWizardService,
    private characterService: CharacterService,
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
    
    // Subscribe to character changes
    this.subscription.add(
      this.characterService.character$.subscribe(character => {
        this.character = character;
      })
    );
    
    // Add listener for route changes to update step indicator accordingly
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Extract the current route's path and map it to the corresponding step
        const currentRoute = this.router.url.split('/').pop();
        if (currentRoute) {
          const stepIndex = this.wizardService.getStepIndexFromRoute(currentRoute);
          if (stepIndex >= 0 && stepIndex !== this.currentStep) {
            // Update the current step without triggering another navigation
            this.wizardService.setStepWithoutNavigation(stepIndex);
            this.currentStep = stepIndex;
          }
        }
      })
    );
    
    // Load saved character if exists
    const hasSavedCharacter = this.characterService.loadCharacter();
    
    // Start or continue the wizard
    if (hasSavedCharacter) {
      // Logic for resuming at the correct step could be added here
      this.wizardService.startWizard();
    } else {
      this.wizardService.startWizard();
    }
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  // Navigate directly to a step (if allowed)
  goToStep(stepIndex: number): void {
    // Validate step data before allowing navigation
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
    
    // For going to the next step, we'll check if the current step is valid
    // This would normally involve validating the current step's form data
    return this.isCurrentStepValid();
  }
  
  // Check if the current step's data is valid
  isCurrentStepValid(): boolean {
    // In a real implementation, this would check the form state of the current step
    // For now, we'll just return true to allow navigation
    // You can add specific validation logic here based on the current step
    return true;
  }
  
  // Helper methods for templates
  isStepComplete(stepIndex: number): boolean {
    if (stepIndex === 0) return true; // First step is always accessible
    
    // For other steps, you can implement logic to check if previous steps are complete
    // This is just a simple implementation that allows clicking on previous steps
    return stepIndex <= this.currentStep;
  }
  
  isStepActive(stepIndex: number): boolean {
    return stepIndex === this.currentStep;
  }
  
  // Reset the wizard and start over
  resetWizard(): void {
    if (confirm('Are you sure you want to reset your character creation progress? All unsaved changes will be lost.')) {
      this.characterService.resetCharacter();
      this.wizardService.resetWizard();
    }
  }
  
  // Save current progress
  saveProgress(): void {
    this.characterService.saveCharacter();
    alert('Character saved successfully!');
  }
}