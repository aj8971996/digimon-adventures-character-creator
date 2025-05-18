import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../core/services/character.service';
import { CampaignType, CampaignTypeConfig } from '../../../core/models/campaign-type';
import { CAMPAIGN_TYPES } from '../../../data/campaign-types';
import { HumanCharacterWizardService } from '../human-character-wizard.service';

@Component({
  selector: 'app-campaign-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-selection.component.html',
  styleUrl: './campaign-selection.component.scss'
})
export class CampaignSelectionComponent implements OnInit {
  campaignTypes: CampaignTypeConfig[] = CAMPAIGN_TYPES;
  selectedCampaign: CampaignType | null = null;
  selectedCampaignConfig: CampaignTypeConfig | null = null;
  age: number = 0;
  ageError: string = '';
  
  constructor(
    private characterService: CharacterService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    // Get the current character from the service
    const character = this.characterService.getCurrentCharacter();
    
    // Set initial values if character already has campaign type and age
    if (character.campaignType) {
      this.selectedCampaign = character.campaignType;
      this.selectedCampaignConfig = this.campaignTypes.find(c => c.type === character.campaignType) || null;
    }
    
    if (character.age) {
      this.age = character.age;
    } else if (this.selectedCampaignConfig) {
      // Set default age to minimum age for campaign
      this.age = this.getMinAge();
    }
    
    this.validateAge();
  }
  
  // Getter methods for template binding
  getMinAge(): number {
    return this.selectedCampaignConfig?.ageRange.min || 0;
  }
  
  getMaxAge(): number {
    return this.selectedCampaignConfig?.ageRange.max || 999;
  }
  
  selectCampaign(campaignType: CampaignType): void {
    this.selectedCampaign = campaignType;
    this.selectedCampaignConfig = this.campaignTypes.find(c => c.type === campaignType) || null;
    
    if (this.selectedCampaignConfig) {
      // Set default age to minimum age for campaign
      this.age = this.getMinAge();
      this.characterService.setCampaignType(campaignType);
      
      // Update the character with the age immediately
      this.characterService.updateCharacter({ age: this.age });
    }
    
    this.validateAge();
  }
  
  validateAge(): void {
    this.ageError = '';
    
    if (!this.selectedCampaignConfig) {
      return;
    }
    
    const { min, max } = this.selectedCampaignConfig.ageRange;
    
    if (this.age < min) {
      this.ageError = `Age must be at least ${min} for ${this.selectedCampaign} campaign`;
    } else if (max && this.age > max) {
      this.ageError = `Age cannot exceed ${max} for ${this.selectedCampaign} campaign`;
    } else {
      // Age is valid, update the character
      this.characterService.updateCharacter({ age: this.age });
    }
  }
  
  canProceed(): boolean {
    return !!this.selectedCampaign && this.age > 0 && !this.ageError;
  }
  
  proceed(): void {
    if (this.canProceed()) {
      // Update character with selected campaign and age
      this.characterService.updateCharacter({
        campaignType: this.selectedCampaign!,
        age: this.age
      });
      
      // Move to next step
      this.wizardService.nextStep();
    }
  }
}