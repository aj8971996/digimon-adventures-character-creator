import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../core/services/character.service';
import { Attribute } from '../../../core/models/attribute';
import { HumanCharacterWizardService } from '../human-character-wizard.service';
import { CampaignType } from '../../../core/models/campaign-type';
import { CAMPAIGN_TYPES } from '../../../data/campaign-types';

@Component({
  selector: 'app-attributes-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attributes-allocation.component.html',
  styleUrl: './attributes-allocation.component.scss'
})
export class AttributesAllocationComponent implements OnInit {
  attributes: Attribute[] = [];
  remainingPoints: number = 0;
  campaignType: CampaignType = CampaignType.Standard;
  maxAttributeValue: number = 3;
  
  constructor(
    private characterService: CharacterService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    // Get current character
    const character = this.characterService.getCurrentCharacter();
    this.attributes = character.attributes;
    this.remainingPoints = character.remainingAttributeCP;
    this.campaignType = character.campaignType;
    
    // Get max attribute value based on campaign type
    const campaignConfig = CAMPAIGN_TYPES.find(c => c.type === this.campaignType);
    if (campaignConfig) {
      this.maxAttributeValue = campaignConfig.startingCPLimit;
    }
  }
  
  increaseAttribute(attribute: Attribute): void {
    if (attribute.value < this.maxAttributeValue && this.remainingPoints > 0) {
      attribute.value++;
      this.remainingPoints--;
      this.updateCharacter();
    }
  }
  
  decreaseAttribute(attribute: Attribute): void {
    if (attribute.value > 0) {
      attribute.value--;
      this.remainingPoints++;
      this.updateCharacter();
    }
  }
  
  updateCharacter(): void {
    this.characterService.updateCharacter({
      attributes: this.attributes,
      remainingAttributeCP: this.remainingPoints
    });
  }
  
  canProceed(): boolean {
    // Can proceed if all points are allocated (remaining points is 0)
    return this.remainingPoints === 0;
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  proceed(): void {
    if (this.canProceed()) {
      this.wizardService.nextStep();
    }
  }
}