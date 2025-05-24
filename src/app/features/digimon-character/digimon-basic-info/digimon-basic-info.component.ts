// src/app/features/digimon-character/digimon-basic-info/digimon-basic-info.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacter, DigimonAttribute, DigimonField, DigimonSize } from '../../../core/models/digimon-character';
import { DigimonStage } from '../../../core/models/digimon-stage';

@Component({
  selector: 'app-digimon-basic-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digimon-basic-info.component.html',
  styleUrl: './digimon-basic-info.component.scss'
})
export class DigimonBasicInfoComponent implements OnInit {
  digimon: DigimonCharacter | null = null;
  
  // Enum values for templates
  stages = Object.values(DigimonStage);
  attributes = Object.values(DigimonAttribute);
  fields = Object.values(DigimonField);
  sizes = Object.values(DigimonSize);

  constructor(private digimonService: DigimonService) {}

  ngOnInit(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
  }

  updateDigimon(): void {
    if (this.digimon) {
      this.digimonService.updateDigimon(this.digimon);
    }
  }

  onStageChange(): void {
    if (this.digimon) {
      // When stage changes, reset the entire Digimon with new DP allocation
      this.digimonService.setStage(this.digimon.stage);
      this.digimon = this.digimonService.getCurrentDigimon();
    }
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0 || !this.digimon) {
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
      if (this.digimon) {
        this.digimon.profileImage = e.target?.result as string;
        this.updateDigimon();
      }
    };
    reader.readAsDataURL(file);
  }
  
  removeImage(): void {
    if (this.digimon) {
      this.digimon.profileImage = undefined;
      this.updateDigimon();
    }
  }

  getStageConfig() {
    if (!this.digimon) return null;
    return this.digimonService.getStageConfig(this.digimon.stage);
  }

  getSizeConfig() {
    if (!this.digimon) return null;
    return this.digimonService.getSizeConfig(this.digimon.size);
  }

  canProceed(): boolean {
    return !!(this.digimon?.name?.trim() && this.digimon?.species?.trim());
  }
}