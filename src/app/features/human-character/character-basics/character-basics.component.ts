import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../../core/services/character.service';
import { HumanCharacterWizardService } from '../human-character-wizard.service';

@Component({
  selector: 'app-character-basics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-basics.component.html',
  styleUrl: './character-basics.component.scss'
})
export class CharacterBasicsComponent implements OnInit {
  name: string = '';
  description: string = '';
  backstory: string = '';
  profileImage?: string = undefined; // Changed from string | null to match the interface
  
  constructor(
    private characterService: CharacterService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    const character = this.characterService.getCurrentCharacter();
    this.name = character.name || '';
    this.description = character.description || '';
    this.backstory = character.backstory || '';
    this.profileImage = character.profileImage;
  }
  
  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }
    
    const file = input.files[0];
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be under 2MB');
      return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Only image files are allowed');
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.profileImage = e.target?.result as string;
      this.updateCharacter();
    };
    reader.readAsDataURL(file);
  }
  
  removeImage(): void {
    this.profileImage = undefined; // Use undefined instead of null
    this.updateCharacter();
  }
  
  updateCharacter(): void {
    this.characterService.updateCharacter({
      name: this.name,
      description: this.description,
      backstory: this.backstory,
      profileImage: this.profileImage
    });
  }
  
  canProceed(): boolean {
    return !!this.name.trim();
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  proceed(): void {
    if (this.canProceed()) {
      this.updateCharacter();
      this.wizardService.nextStep();
    }
  }
}