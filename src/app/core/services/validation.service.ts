import { Injectable } from '@angular/core';
import { CAMPAIGN_TYPES } from '../../data/campaign-types';
import { CampaignType, CampaignTypeConfig } from '../models/campaign-type';
import { HumanCharacter } from '../models/human-character';
import { TormentType } from '../models/torment';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  validateAge(age: number, campaignType: CampaignType): boolean {
    const config = this.getCampaignConfig(campaignType);
    
    if (age < config.ageRange.min) {
      return false;
    }
    
    if (config.ageRange.max && age > config.ageRange.max) {
      return false;
    }
    
    return true;
  }
  
  validateAttributePointLimit(value: number, campaignType: CampaignType): boolean {
    const config = this.getCampaignConfig(campaignType);
    return value <= config.startingCPLimit;
  }
  
  validateSkillPointLimit(value: number, campaignType: CampaignType): boolean {
    const config = this.getCampaignConfig(campaignType);
    return value <= config.startingCPLimit;
  }
  
  validateTormentProgress(type: TormentType, progressBoxes: number): boolean {
    switch (type) {
      case TormentType.Minor:
        return progressBoxes <= 2;
      case TormentType.Major:
        return progressBoxes <= 3;
      case TormentType.Terrible:
        return progressBoxes <= 4;
      default:
        return false;
    }
  }
  
  validateCharacterComplete(character: HumanCharacter): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!character.name) {
      errors.push('Character name is required');
    }
    
    if (!this.validateAge(character.age, character.campaignType)) {
      const config = this.getCampaignConfig(character.campaignType);
      if (config.ageRange.max) {
        errors.push(`Age must be between ${config.ageRange.min} and ${config.ageRange.max} for ${character.campaignType} campaign`);
      } else {
        errors.push(`Age must be at least ${config.ageRange.min} for ${character.campaignType} campaign`);
      }
    }
    
    if (character.remainingAttributeCP !== 0) {
      errors.push(`You must allocate all attribute creation points (${character.remainingAttributeCP} remaining)`);
    }
    
    if (character.remainingSkillCP !== 0) {
      errors.push(`You must allocate all skill creation points (${character.remainingSkillCP} remaining)`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  private getCampaignConfig(campaignType: CampaignType): CampaignTypeConfig {
    return CAMPAIGN_TYPES.find(c => c.type === campaignType)!;
  }
}