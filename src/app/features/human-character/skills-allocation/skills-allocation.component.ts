import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character.service';
import { Attribute } from '../../models/attribute';
import { HumanCharacterWizardService } from '../../services/human-character-wizard.service';
import { CampaignType } from '../../models/campaign-type';
import { CAMPAIGN_TYPES } from '../../../data/campaign-types';

@Component({
  selector: 'app-skills-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills-allocation.component.html',
  styleUrl: './skills-allocation.component.scss'
})
export class SkillsAllocationComponent implements OnInit {
  attributes: Attribute[] = [];
  remainingPoints: number = 0;
  campaignType: CampaignType = CampaignType.Standard;
  maxSkillValue: number = 3;
  
  constructor(
    private characterService: CharacterService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    // Get current character
    const character = this.characterService.getCurrentCharacter();
    this.attributes = character.attributes;
    this.remainingPoints = character.remainingSkillCP;
    this.campaignType = character.campaignType;
    
    // Get max skill value based on campaign type
    const campaignConfig = CAMPAIGN_TYPES.find(c => c.type === this.campaignType);
    if (campaignConfig) {
      this.maxSkillValue = campaignConfig.startingCPLimit;
    }
  }
  
  increaseSkill(skill: any): void {
    if (skill.value < this.maxSkillValue && this.remainingPoints > 0) {
      skill.value++;
      this.remainingPoints--;
      this.updateCharacter();
    }
  }
  
  decreaseSkill(skill: any): void {
    if (skill.value > 0) {
      skill.value--;
      this.remainingPoints++;
      this.updateCharacter();
    }
  }
  
  updateCharacter(): void {
    this.characterService.updateCharacter({
      attributes: this.attributes,
      remainingSkillCP: this.remainingPoints
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