import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../../core/services/character.service';
import { HumanCharacterWizardService } from '../human-character-wizard.service';
import { ValidationService } from '../../../core/services/validation.service';
import { HumanCharacter } from '../../../core/models/human-character';

@Component({
  selector: 'app-character-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-summary.component.html',
  styleUrl: './character-summary.component.scss'
})
export class CharacterSummaryComponent implements OnInit {
  character: HumanCharacter | null = null;
  validationErrors: string[] = [];
  showSaveSuccess: boolean = false;
  
  constructor(
    private characterService: CharacterService,
    private validationService: ValidationService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    this.character = this.characterService.getCurrentCharacter();
    this.validateCharacter();
  }
  
  validateCharacter(): void {
    if (!this.character) return;
    
    const validation = this.validationService.validateCharacterComplete(this.character);
    this.validationErrors = validation.errors;
  }
  
  saveCharacter(): void {
    this.characterService.saveCharacter();
    this.showSaveSuccess = true;
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      this.showSaveSuccess = false;
    }, 3000);
  }
  
  resetCharacter(): void {
    if (confirm('Are you sure you want to reset your character? All progress will be lost.')) {
      this.characterService.resetCharacter();
      this.wizardService.goToStep(0); // Go back to first step
    }
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  finish(): void {
    // For now, just save the character
    this.saveCharacter();
  }
}