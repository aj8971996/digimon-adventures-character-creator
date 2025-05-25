// src/app/features/digimon-character/digimon-character-summary/digimon-character-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacterWizardService } from '../digimon-character-wizard.service';
import { EvolutionLineManagerService } from '../../../core/services/evolution-line-manager.service';
import { DigimonPdfGeneratorService } from '../../../core/services/digimon-pdf-generator.service';
import { DigimonCharacter } from '../../../core/models/digimon-character';
import { DigimonStage } from '../../../core/models/digimon-stage';

@Component({
  selector: 'app-digimon-character-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digimon-character-summary.component.html',
  styleUrl: './digimon-character-summary.component.scss'
})
export class DigimonCharacterSummaryComponent implements OnInit {
  // Current single digimon (for single-stage creation)
  digimon: DigimonCharacter | null = null;
  
  // Evolution line data (for multi-stage creation)
  evolutionLineCharacters: DigimonCharacter[] = [];
  evolutionSummary: any = null;
  currentViewingIndex: number = 0;
  
  // UI state
  validationErrors: string[] = [];
  showSaveSuccess: boolean = false;
  isEvolutionLine: boolean = false;
  isEvolutionLineComplete: boolean = false;
  showCompleteButton: boolean = true;
  
  constructor(
    private digimonService: DigimonService,
    private wizardService: DigimonCharacterWizardService,
    private evolutionLineManager: EvolutionLineManagerService,
    private pdfGeneratorService: DigimonPdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadCharacterData();
  }
  
  loadCharacterData(): void {
    // Check if we have an evolution line
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    
    if (evolutionLine) {
      this.isEvolutionLine = true;
      this.evolutionLineCharacters = this.evolutionLineManager.getAllCreatedCharacters();
      this.evolutionSummary = this.evolutionLineManager.getEvolutionSummary();
      this.isEvolutionLineComplete = this.evolutionLineManager.isEvolutionLineComplete();
      this.currentViewingIndex = 0;
      
      // Validate all characters in the evolution line
      this.validateEvolutionLine();
    } else {
      // Single digimon creation
      this.isEvolutionLine = false;
      this.digimon = this.digimonService.getCurrentDigimon();
      this.validateSingleDigimon();
    }
  }
  
  validateSingleDigimon(): void {
    if (!this.digimon) return;
    
    const validation = this.digimonService.validateDigimon(this.digimon);
    this.validationErrors = validation.errors;
  }

  validateEvolutionLine(): void {
    this.validationErrors = [];
    
    // Check if current character is valid
    const currentDigimon = this.digimonService.getCurrentDigimon();
    if (currentDigimon) {
      const validation = this.digimonService.validateDigimon(currentDigimon);
      if (!validation.valid) {
        this.validationErrors.push(...validation.errors.map(error => 
          `Current Character: ${error}`
        ));
      }
    }

    // Validate each character in the evolution line
    for (const character of this.evolutionLineCharacters) {
      const validation = this.digimonService.validateDigimon(character);
      if (!validation.valid) {
        validation.errors.forEach(error => {
          this.validationErrors.push(`${character.name || character.species}: ${error}`);
        });
      }
    }
  }
  
  saveDigimon(): void {
    if (this.isEvolutionLine) {
      // Save all characters in evolution line
      this.evolutionLineCharacters.forEach(character => {
        // Save each character individually
        localStorage.setItem(`digimon_${character.id}`, JSON.stringify(character));
      });
      
      // Also save the current character if not yet saved
      const currentDigimon = this.digimonService.getCurrentDigimon();
      if (currentDigimon && !this.isEvolutionLineComplete) {
        const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
        if (evolutionLine) {
          this.evolutionLineManager.saveCharacterForStage(
            evolutionLine.currentEditingStage,
            currentDigimon,
            evolutionLine.currentEditingEvolutionId
          );
        }
      }
    } else {
      this.digimonService.saveDigimon();
    }
    
    this.showSaveSuccess = true;
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      this.showSaveSuccess = false;
    }, 3000);
  }
  
  resetDigimon(): void {
    const confirmMessage = this.isEvolutionLine 
      ? 'Are you sure you want to reset your entire evolution line? All progress will be lost.'
      : 'Are you sure you want to reset your Digimon? All progress will be lost.';
      
    if (confirm(confirmMessage)) {
      if (this.isEvolutionLine) {
        this.evolutionLineManager.resetEvolutionLine();
      }
      this.digimonService.resetDigimon();
      this.wizardService.resetWizard();
    }
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  /**
   * Handle the complete/continue button action
   */
  completeOrContinue(): void {
    if (this.validationErrors.length > 0) {
      alert('Please fix all validation errors before proceeding.');
      return;
    }

    if (this.isEvolutionLine && !this.isEvolutionLineComplete) {
      // Continue to next character in evolution line
      this.continueEvolutionLine();
    } else {
      // Complete the entire creation process
      this.finish();
    }
  }

  /**
   * Continue to the next character in the evolution line
   */
  continueEvolutionLine(): void {
    if (!this.isEvolutionLine) return;

    // Save current character
    this.saveCurrentCharacterToEvolutionLine();

    // Get next character to create
    const nextToCreate = this.evolutionLineManager.getNextToCreate();
    
    if (nextToCreate) {
      // Show confirmation dialog
      const nextCharacterName = this.getCharacterNameForStage(nextToCreate.stage, nextToCreate.evolutionId);
      const confirmMessage = `Current character saved! Ready to create ${nextCharacterName} (${nextToCreate.stage})?`;
      
      if (confirm(confirmMessage)) {
        // Proceed to next character
        this.wizardService.completeCurrentCharacterAndProceedToNext();
      }
    } else {
      // Evolution line is complete
      this.isEvolutionLineComplete = true;
      this.loadCharacterData(); // Refresh data
      alert('Evolution line creation completed!');
    }
  }

  /**
   * Save the current character to the evolution line
   */
  private saveCurrentCharacterToEvolutionLine(): void {
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    const currentDigimon = this.digimonService.getCurrentDigimon();
    
    if (evolutionLine && currentDigimon) {
      this.evolutionLineManager.saveCharacterForStage(
        evolutionLine.currentEditingStage,
        currentDigimon,
        evolutionLine.currentEditingEvolutionId
      );
    }
  }

  /**
   * Get the character name for a given stage and evolution ID
   */
  private getCharacterNameForStage(stage: DigimonStage, evolutionId?: string): string {
    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    if (!evolutionLine) return 'Unknown';

    if (stage === DigimonStage.Rookie) {
      return evolutionLine.rookieName;
    } else if (stage === DigimonStage.Champion && evolutionId) {
      const champion = evolutionLine.championOptions.find(c => c.id === evolutionId);
      return champion ? champion.name : 'Unknown Champion';
    }

    return 'Unknown';
  }
  
  finish(): void {
    if (this.validationErrors.length > 0) {
      alert('Please fix all validation errors before completing the Digimon creation.');
      return;
    }
    
    this.saveDigimon();
    
    const successMessage = this.isEvolutionLine
      ? `Evolution line creation completed successfully! Created ${this.evolutionLineCharacters.length + (this.isEvolutionLineComplete ? 0 : 1)} character sheets.`
      : 'Digimon creation completed successfully!';
      
    alert(successMessage);
  }

  /**
   * Get the text for the complete/continue button
   */
  getCompleteButtonText(): string {
    if (this.isEvolutionLine && !this.isEvolutionLineComplete) {
      const nextToCreate = this.evolutionLineManager.getNextToCreate();
      if (nextToCreate) {
        const nextCharacterName = this.getCharacterNameForStage(nextToCreate.stage, nextToCreate.evolutionId);
        return `Save & Create ${nextCharacterName}`;
      }
      return 'Continue Evolution Line';
    }
    return 'Complete';
  }

  /**
   * Get the current character being created (for evolution lines)
   */
  getCurrentCharacterInfo(): { stage: DigimonStage; name: string } | null {
    if (!this.isEvolutionLine) return null;

    const evolutionLine = this.evolutionLineManager.getCurrentEvolutionLine();
    if (!evolutionLine) return null;

    const characterName = this.getCharacterNameForStage(
      evolutionLine.currentEditingStage,
      evolutionLine.currentEditingEvolutionId
    );

    return {
      stage: evolutionLine.currentEditingStage,
      name: characterName
    };
  }

  /**
   * Preview the Digimon character sheet as PDF
   */
  previewPdf(): void {
    if (this.isEvolutionLine) {
      this.previewEvolutionLinePdf();
    } else if (this.digimon) {
      this.pdfGeneratorService.previewDigimonCharacterPdf(this.digimon);
    }
  }

  /**
   * Download the Digimon character sheet as PDF
   */
  downloadPdf(): void {
    if (this.isEvolutionLine) {
      this.downloadEvolutionLinePdf();
    } else if (this.digimon) {
      this.pdfGeneratorService.generateDigimonCharacterPdf(this.digimon);
    }
  }

  /**
   * Preview evolution line as combined PDF
   */
  previewEvolutionLinePdf(): void {
    // For now, preview the currently viewed character
    // In a full implementation, you'd create a combined PDF
    const currentCharacter = this.getCurrentViewingCharacter();
    if (currentCharacter) {
      this.pdfGeneratorService.previewDigimonCharacterPdf(currentCharacter);
    } else {
      // Preview the current character being created
      const currentDigimon = this.digimonService.getCurrentDigimon();
      if (currentDigimon) {
        this.pdfGeneratorService.previewDigimonCharacterPdf(currentDigimon);
      }
    }
  }

  /**
   * Download evolution line as combined PDF
   */
  downloadEvolutionLinePdf(): void {
    // For now, download the currently viewed character
    // In a full implementation, you'd create a combined PDF
    const currentCharacter = this.getCurrentViewingCharacter();
    if (currentCharacter) {
      this.pdfGeneratorService.generateDigimonCharacterPdf(currentCharacter);
    } else {
      // Download the current character being created
      const currentDigimon = this.digimonService.getCurrentDigimon();
      if (currentDigimon) {
        this.pdfGeneratorService.generateDigimonCharacterPdf(currentDigimon);
      }
    }
  }

  // Evolution line navigation methods
  getCurrentViewingCharacter(): DigimonCharacter | null {
    if (!this.isEvolutionLine || this.currentViewingIndex >= this.evolutionLineCharacters.length) {
      return null;
    }
    return this.evolutionLineCharacters[this.currentViewingIndex];
  }

  previousCharacter(): void {
    if (this.currentViewingIndex > 0) {
      this.currentViewingIndex--;
    }
  }

  nextCharacter(): void {
    if (this.currentViewingIndex < this.evolutionLineCharacters.length - 1) {
      this.currentViewingIndex++;
    }
  }

  goToCharacter(index: number): void {
    if (index >= 0 && index < this.evolutionLineCharacters.length) {
      this.currentViewingIndex = index;
    }
  }

  getCharacterDisplayName(character: DigimonCharacter): string {
    return `${character.name || character.species} (${character.stage})`;
  }

  // Helper methods for display
  getStatTotal(): number {
    const character = this.getCurrentViewingCharacter() || this.digimon;
    if (!character) return 0;
    return Object.values(character.stats).reduce((sum, value) => sum + value, 0);
  }

  getQualityNames(): string[] {
    const character = this.getCurrentViewingCharacter() || this.digimon;
    if (!character) return [];
    return character.qualities.map(q => {
      const rankText = q.rank > 1 ? ` (Rank ${q.rank})` : '';
      return `${q.qualityId}${rankText}`;
    });
  }

  getEvolutionLineProgress(): { completed: number; total: number; percentage: number } {
    if (!this.isEvolutionLine) {
      return { completed: 1, total: 1, percentage: 100 };
    }
    return this.evolutionLineManager.getCreationProgress();
  }

  /**
   * Format stat name to be more readable
   */
  formatStatName(name: string | unknown): string {
    if (typeof name !== 'string') {
      return String(name);
    }
    
    // Handle camelCase to proper case
    const formatted = name.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}