import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../../core/services/character.service';
import { HumanCharacterWizardService } from '../human-character-wizard.service';
import { ValidationService } from '../../../core/services/validation.service';
import { PdfExportService } from '../../../core/services/pdf-generator.service';
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
    private wizardService: HumanCharacterWizardService,
    private pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.loadCharacter();
  }
  
  loadCharacter(): void {
    this.character = this.characterService.getCurrentCharacter();
    this.validateCharacter();
    
    // Log character to verify age is present
    console.log('Current character:', this.character);
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
    if (this.validationErrors.length > 0) {
      alert('Please fix all validation errors before completing the character creation.');
      return;
    }
    
    this.saveCharacter();
    alert('Character creation completed successfully!');
    
    // Additional completion logic could be added here
    // For example, navigating to a different page or showing a completion modal
  }
  
  /**
   * Preview the character sheet as PDF
   */
  previewPdf(): void {
    if (!this.character) return;
    
    this.pdfExportService.previewHumanCharacterPdf(this.character);
  }

  /**
   * Download the character sheet as PDF
   */
  downloadPdf(): void {
    if (!this.character) return;
    
    this.pdfExportService.generateHumanCharacterPdf(this.character);
  }
}