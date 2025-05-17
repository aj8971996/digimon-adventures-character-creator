import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../core/services/character.service';
import { HumanCharacterWizardService } from '../human-character-wizard.service';
import { ValidationService } from '../../../core/services/validation.service';
import { Torment, TormentType } from '../../../core/models/torment';

@Component({
  selector: 'app-torments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './torments.component.html',
  styleUrl: './torments.component.scss'
})
export class TormentsComponent implements OnInit {
  torments: Torment[] = [];
  newTorment: Partial<Torment> = {
    name: '',
    description: '',
    type: TormentType.Minor,
    progress: 0,
    totalBoxes: 0,
    maxInitialProgress: 0
  };
  editIndex: number | null = null;
  remainingCP: number = 0;
  
  tormentTypes = [
    { value: TormentType.Minor, label: 'Minor', cp: 1, maxProgress: 2 },
    { value: TormentType.Major, label: 'Major', cp: 2, maxProgress: 3 },
    { value: TormentType.Terrible, label: 'Terrible', cp: 3, maxProgress: 4 }
  ];
  
  constructor(
    private characterService: CharacterService,
    private validationService: ValidationService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    const character = this.characterService.getCurrentCharacter();
    this.torments = [...character.torments];
    
    // Ensure all torments have totalBoxes set correctly
    this.torments.forEach(torment => {
      if (!torment.totalBoxes) {
        torment.totalBoxes = this.getMaxProgress(torment.type);
      }
    });
    
    this.remainingCP = character.remainingTormentCP;
    
    // If no torment CP has been set yet, calculate based on campaign type
    if (this.remainingCP === 0 && this.torments.length === 0) {
      // Start with at least some default points based on campaign
      switch (character.campaignType) {
        case 'Standard':
          this.remainingCP = 2;
          break;
        case 'Enhanced':
          this.remainingCP = 3;
          break;
        case 'Extreme':
          this.remainingCP = 4;
          break;
        default:
          this.remainingCP = 2;
      }
      
      // Update character with initial torment CP
      this.characterService.updateCharacter({
        remainingTormentCP: this.remainingCP
      });
    }
  }
  
  // Helper method for template to get torment type label
  getTormentTypeLabel(type: TormentType): string {
    const tormentType = this.tormentTypes.find(t => t.value === type);
    return tormentType ? tormentType.label : '';
  }
  
  getTormentCPCost(type: TormentType): number {
    const tormentType = this.tormentTypes.find(t => t.value === type);
    return tormentType ? tormentType.cp : 0;
  }
  
  getMaxProgress(type: TormentType): number {
    const tormentType = this.tormentTypes.find(t => t.value === type);
    return tormentType ? tormentType.maxProgress : 0;
  }
  
  canAddTorment(type: TormentType): boolean {
    const cost = this.getTormentCPCost(type);
    return cost <= this.remainingCP;
  }
  
  addTorment(): void {
    if (!this.newTorment.name?.trim() || !this.newTorment.type) return;
    
    const cost = this.getTormentCPCost(this.newTorment.type);
    if (cost > this.remainingCP) return;
    
    const maxProgress = this.getMaxProgress(this.newTorment.type);
    
    const torment: Torment = {
      id: this.generateId(),
      name: this.newTorment.name.trim(),
      description: this.newTorment.description?.trim() || '',
      type: this.newTorment.type,
      progress: 0,
      totalBoxes: maxProgress,
      maxInitialProgress: 0
    };
    
    this.torments.push(torment);
    this.remainingCP -= cost;
    this.updateCharacter();
    this.resetForm();
  }
  
  startEdit(index: number): void {
    this.editIndex = index;
    const torment = this.torments[index];
    this.newTorment = { ...torment };
  }
  
  cancelEdit(): void {
    this.editIndex = null;
    this.resetForm();
  }
  
  saveEdit(): void {
    if (this.editIndex === null || !this.newTorment.name?.trim() || !this.newTorment.type) return;
    
    const oldTorment = this.torments[this.editIndex];
    const oldCost = this.getTormentCPCost(oldTorment.type);
    const newCost = this.getTormentCPCost(this.newTorment.type as TormentType);
    
    // Check if we have enough CP to change type
    if (newCost > oldCost && (newCost - oldCost) > this.remainingCP) {
      return; // Not enough CP to upgrade
    }
    
    // Update CP cost
    this.remainingCP += oldCost - newCost;
    
    const maxProgress = this.getMaxProgress(this.newTorment.type as TormentType);
    
    // Update torment
    this.torments[this.editIndex] = {
      id: oldTorment.id,
      name: this.newTorment.name.trim(),
      description: this.newTorment.description?.trim() || '',
      type: this.newTorment.type as TormentType,
      progress: this.newTorment.progress || 0,
      totalBoxes: maxProgress,
      maxInitialProgress: oldTorment.maxInitialProgress
    };
    
    this.updateCharacter();
    this.editIndex = null;
    this.resetForm();
  }
  
  deleteTorment(index: number): void {
    const torment = this.torments[index];
    const cost = this.getTormentCPCost(torment.type);
    
    this.torments.splice(index, 1);
    this.remainingCP += cost;
    this.updateCharacter();
    
    if (this.editIndex === index) {
      this.editIndex = null;
      this.resetForm();
    }
  }
  
  increaseProgress(index: number): void {
    const torment = this.torments[index];
    // Use torment.totalBoxes for consistency
    if (torment.progress < torment.totalBoxes) {
      torment.progress++;
      this.updateCharacter();
    }
  }
  
  decreaseProgress(index: number): void {
    const torment = this.torments[index];
    
    if (torment.progress > 0) {
      torment.progress--;
      this.updateCharacter();
    }
  }
  
  resetForm(): void {
    // Initialize totalBoxes based on the default type
    const defaultType = TormentType.Minor;
    const defaultMaxProgress = this.getMaxProgress(defaultType);
    
    this.newTorment = {
      name: '',
      description: '',
      type: defaultType,
      progress: 0,
      totalBoxes: defaultMaxProgress,
      maxInitialProgress: 0
    };
  }
  
  updateCharacter(): void {
    this.characterService.updateCharacter({
      torments: [...this.torments],
      remainingTormentCP: this.remainingCP
    });
  }
  
  generateId(): string {
    return 'torment_' + Math.random().toString(36).substring(2, 9);
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  proceed(): void {
    this.wizardService.nextStep();
  }
}