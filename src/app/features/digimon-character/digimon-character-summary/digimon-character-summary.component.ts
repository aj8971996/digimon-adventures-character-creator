// src/app/features/digimon-character/digimon-character-summary/digimon-character-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacterWizardService } from '../digimon-character-wizard.service';
import { DigimonCharacter } from '../../../core/models/digimon-character';

@Component({
  selector: 'app-digimon-character-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digimon-character-summary.component.html',
  styleUrl: './digimon-character-summary.component.scss'
})
export class DigimonCharacterSummaryComponent implements OnInit {
  digimon: DigimonCharacter | null = null;
  validationErrors: string[] = [];
  showSaveSuccess: boolean = false;
  
  constructor(
    private digimonService: DigimonService,
    private wizardService: DigimonCharacterWizardService
  ) {}

  ngOnInit(): void {
    this.loadDigimon();
  }
  
  loadDigimon(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
    this.validateDigimon();
  }
  
  validateDigimon(): void {
    if (!this.digimon) return;
    
    const validation = this.digimonService.validateDigimon(this.digimon);
    this.validationErrors = validation.errors;
  }
  
  saveDigimon(): void {
    this.digimonService.saveDigimon();
    this.showSaveSuccess = true;
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      this.showSaveSuccess = false;
    }, 3000);
  }
  
  resetDigimon(): void {
    if (confirm('Are you sure you want to reset your Digimon? All progress will be lost.')) {
      this.digimonService.resetDigimon();
      this.wizardService.resetWizard();
    }
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  finish(): void {
    if (this.validationErrors.length > 0) {
      alert('Please fix all validation errors before completing the Digimon creation.');
      return;
    }
    
    this.saveDigimon();
    alert('Digimon creation completed successfully!');
  }

  // Helper methods for display
  getStatTotal(): number {
    if (!this.digimon) return 0;
    return Object.values(this.digimon.stats).reduce((sum, value) => sum + value, 0);
  }

  getQualityNames(): string[] {
    if (!this.digimon) return [];
    return this.digimon.qualities.map(q => {
      const rankText = q.rank > 1 ? ` (Rank ${q.rank})` : '';
      return `${q.qualityId}${rankText}`;
    });
  }
}