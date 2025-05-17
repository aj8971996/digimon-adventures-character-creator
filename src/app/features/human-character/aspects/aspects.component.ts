import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../core/services/character.service';
import { HumanCharacterWizardService } from '../human-character-wizard.service';
import { Aspect, AspectType } from '../../../core/models/aspect';

@Component({
  selector: 'app-aspects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aspects.component.html',
  styleUrl: './aspects.component.scss'
})
export class AspectsComponent implements OnInit {
  aspects: Aspect[] = [];
  newAspect: Aspect = {
    id: '', 
    name: '', 
    description: '',
    type: AspectType.Major,
    triggers: '',
    effects: []
  };
  editIndex: number | null = null;
  
  constructor(
    private characterService: CharacterService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    const character = this.characterService.getCurrentCharacter();
    this.aspects = [...character.aspects];
  }
  
  // Helper method for template validation
  isNameValid(): boolean {
    return this.newAspect && this.newAspect.name ? this.newAspect.name.trim().length > 0 : false;
  }
  
  addAspect(): void {
    if (!this.isNameValid()) return;
    
    const aspect: Aspect = {
      id: this.generateId(),
      name: this.newAspect.name.trim(),
      description: this.newAspect.description ? this.newAspect.description.trim() : '',
      type: this.newAspect.type,
      triggers: this.newAspect.triggers ? this.newAspect.triggers.trim() : '',
      effects: [...this.newAspect.effects]
    };
    
    this.aspects.push(aspect);
    this.updateCharacter();
    this.resetForm();
  }
  
  startEdit(index: number): void {
    this.editIndex = index;
    this.newAspect = { ...this.aspects[index] };
  }
  
  cancelEdit(): void {
    this.editIndex = null;
    this.resetForm();
  }
  
  saveEdit(): void {
    if (this.editIndex === null || !this.isNameValid()) return;
    
    this.aspects[this.editIndex] = {
      ...this.newAspect,
      name: this.newAspect.name.trim(),
      description: this.newAspect.description ? this.newAspect.description.trim() : '',
      triggers: this.newAspect.triggers ? this.newAspect.triggers.trim() : ''
    };
    
    this.updateCharacter();
    this.editIndex = null;
    this.resetForm();
  }
  
  deleteAspect(index: number): void {
    this.aspects.splice(index, 1);
    this.updateCharacter();
    
    if (this.editIndex === index) {
      this.editIndex = null;
      this.resetForm();
    }
  }
  
  resetForm(): void {
    this.newAspect = { 
      id: '', 
      name: '', 
      description: '',
      type: AspectType.Major,
      triggers: '',
      effects: []
    };
  }
  
  updateCharacter(): void {
    this.characterService.updateCharacter({
      aspects: [...this.aspects]
    });
  }
  
  generateId(): string {
    return 'aspect_' + Math.random().toString(36).substring(2, 9);
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  proceed(): void {
    this.wizardService.nextStep();
  }
}