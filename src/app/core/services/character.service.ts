import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ATTRIBUTES } from '../../data/attributes';
import { v4 as uuidv4 } from 'uuid'; // You'll need to npm install uuid
import { CalculationService } from './calculation.service';
import { HumanCharacter } from '../models/human-character';
import { CampaignType } from '../models/campaign-type';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private initialCharacter: HumanCharacter = {
    id: uuidv4(),
    name: '',
    age: 0,
    campaignType: CampaignType.Standard,
    attributes: JSON.parse(JSON.stringify(ATTRIBUTES)), // Deep copy
    specialOrders: [],
    aspects: [],
    torments: [],
    derivedStats: {
      woundBox: 2,
      speed: 0,
      accuracyPool: 0,
      dodgePool: 0,
      armor: 0,
      damage: 0
    },
    remainingAttributeCP: 12,
    remainingSkillCP: 18,
    remainingTormentCP: 0
  };

  private characterSubject = new BehaviorSubject<HumanCharacter>(this.initialCharacter);
  public character$: Observable<HumanCharacter> = this.characterSubject.asObservable();

  constructor(private calculationService: CalculationService) {}

  getCurrentCharacter(): HumanCharacter {
    return this.characterSubject.getValue();
  }

  updateCharacter(updatedCharacter: Partial<HumanCharacter>): void {
    const currentCharacter = this.characterSubject.getValue();
    const newCharacter = { ...currentCharacter, ...updatedCharacter };
    
    // Recalculate derived stats if attributes or skills have changed
    if (updatedCharacter.attributes) {
      newCharacter.derivedStats = this.calculationService.calculateDerivedStats(newCharacter);
    }
    
    this.characterSubject.next(newCharacter);
  }

  setCampaignType(campaignType: CampaignType): void {
    const currentCharacter = this.characterSubject.getValue();
    const cpValues = this.getCPValues(campaignType);
    
    this.characterSubject.next({
      ...currentCharacter,
      campaignType,
      remainingAttributeCP: cpValues.attributes,
      remainingSkillCP: cpValues.skills
    });
  }

  resetCharacter(): void {
    this.characterSubject.next(this.initialCharacter);
  }

  saveCharacter(): void {
    const character = this.characterSubject.getValue();
    localStorage.setItem('savedCharacter', JSON.stringify(character));
  }

  loadCharacter(): boolean {
    const savedCharacter = localStorage.getItem('savedCharacter');
    if (savedCharacter) {
      this.characterSubject.next(JSON.parse(savedCharacter));
      return true;
    }
    return false;
  }

  private getCPValues(campaignType: CampaignType): { attributes: number; skills: number } {
    switch (campaignType) {
      case CampaignType.Standard:
        return { attributes: 12, skills: 18 };
      case CampaignType.Enhanced:
        return { attributes: 18, skills: 22 };
      case CampaignType.Extreme:
        return { attributes: 22, skills: 28 };
      default:
        return { attributes: 12, skills: 18 };
    }
  }
}