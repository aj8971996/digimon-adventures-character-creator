import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../core/services/character.service';
import { HumanCharacterWizardService } from '../human-character-wizard.service';
import { CalculationService } from '../../../core/services/calculation.service';
import { SpecialOrder } from '../../../core/models/special-order';
import { SPECIAL_ORDERS } from '../../../data/special-orders';
import { CampaignType } from '../../../core/models/campaign-type';

@Component({
  selector: 'app-special-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './special-orders.component.html',
  styleUrl: './special-orders.component.scss'
})
export class SpecialOrdersComponent implements OnInit {
  availableOrders: SpecialOrder[] = [];
  selectedOrders: SpecialOrder[] = [];
  campaignType: CampaignType = CampaignType.Standard;
  errorMessages: string[] = [];
  
  constructor(
    private characterService: CharacterService,
    private calculationService: CalculationService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    const character = this.characterService.getCurrentCharacter();
    this.campaignType = character.campaignType;
    
    // Create a deep copy of special orders to work with
    this.availableOrders = JSON.parse(JSON.stringify(SPECIAL_ORDERS));
    
    // Mark orders as selected if they're already in the character
    if (character.specialOrders && character.specialOrders.length > 0) {
      character.specialOrders.forEach(selectedOrder => {
        const index = this.availableOrders.findIndex(order => order.id === selectedOrder.id);
        if (index !== -1) {
          this.availableOrders[index].selected = true;
        }
      });
    }
    
    this.updateSelectedOrders();
    this.validateSpecialOrders();
  }
  
  toggleOrder(order: SpecialOrder): void {
    order.selected = !order.selected;
    this.updateSelectedOrders();
    this.validateSpecialOrders();
  }
  
  updateSelectedOrders(): void {
    this.selectedOrders = this.availableOrders.filter(order => order.selected);
    
    // Update character
    this.characterService.updateCharacter({
      specialOrders: this.selectedOrders
    });
  }
  
  validateSpecialOrders(): void {
    const character = this.characterService.getCurrentCharacter();
    this.errorMessages = this.calculationService.validateSpecialOrders(character);
  }
  
  getRequiredValue(order: SpecialOrder): number {
    switch (this.campaignType) {
      case CampaignType.Standard:
        return order.requirements.standard;
      case CampaignType.Enhanced:
        return order.requirements.enhanced;
      case CampaignType.Extreme:
        return order.requirements.extreme;
      default:
        return 0;
    }
  }
  
  meetsRequirement(order: SpecialOrder): boolean {
    const character = this.characterService.getCurrentCharacter();
    const attribute = character.attributes.find(attr => attr.id === order.attributeId);
    if (!attribute) return false;
    
    const requiredValue = this.getRequiredValue(order);
    return attribute.value >= requiredValue;
  }
  
  getAttributeName(attributeId: string): string {
    const character = this.characterService.getCurrentCharacter();
    const attribute = character.attributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.name : '';
  }
  
  getAttributeValue(attributeId: string): number {
    const character = this.characterService.getCurrentCharacter();
    const attribute = character.attributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.value : 0;
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  proceed(): void {
    this.wizardService.nextStep();
  }
}