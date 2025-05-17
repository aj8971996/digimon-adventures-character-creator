import { Injectable } from '@angular/core';
import { DerivedStats, HumanCharacter } from '../models/human-character';
import { Attribute } from '../models/attribute';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  constructor() {}

  calculateDerivedStats(character: HumanCharacter): DerivedStats {
    const bodyValue = this.getAttributeValue(character.attributes, 'body');
    const agilityValue = this.getAttributeValue(character.attributes, 'agility');
    const enduranceValue = this.getSkillValue(character.attributes, 'endurance');
    const survivalValue = this.getSkillValue(character.attributes, 'survival');
    const fightValue = this.getSkillValue(character.attributes, 'fight');
    const dodgeValue = this.getSkillValue(character.attributes, 'dodge');

    return {
      woundBox: Math.max(2, bodyValue + enduranceValue),
      speed: agilityValue + survivalValue,
      accuracyPool: agilityValue + fightValue,
      dodgePool: agilityValue + dodgeValue,
      armor: bodyValue + enduranceValue,
      damage: bodyValue + fightValue
    };
  }

  validateSpecialOrders(character: HumanCharacter): string[] {
    const errors: string[] = [];
    const { campaignType, attributes, specialOrders } = character;

    specialOrders.forEach(order => {
      const attributeValue = this.getAttributeValue(attributes, order.attributeId);
      let requiredValue = 0;

      switch (campaignType) {
        case 'Standard':
          requiredValue = order.requirements.standard;
          break;
        case 'Enhanced':
          requiredValue = order.requirements.enhanced;
          break;
        case 'Extreme':
          requiredValue = order.requirements.extreme;
          break;
      }

      if (attributeValue < requiredValue) {
        errors.push(`${order.name} requires ${requiredValue} ${this.getAttributeName(attributes, order.attributeId)}`);
      }
    });

    return errors;
  }

  private getAttributeValue(attributes: Attribute[], attributeId: string): number {
    const attribute = attributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.value : 0;
  }

  private getAttributeName(attributes: Attribute[], attributeId: string): string {
    const attribute = attributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.name : '';
  }

  private getSkillValue(attributes: Attribute[], skillId: string): number {
    for (const attribute of attributes) {
      const skill = attribute.skills.find(s => s.id === skillId);
      if (skill) {
        return skill.value;
      }
    }
    return 0;
  }
}