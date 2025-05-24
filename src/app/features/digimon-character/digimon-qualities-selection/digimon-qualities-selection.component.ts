// src/app/features/digimon-character/digimon-qualities-selection/digimon-qualities-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacterWizardService } from '../digimon-character-wizard.service';
import { DigimonCharacter, QualitySelection } from '../../../core/models/digimon-character';
import { DIGIMON_QUALITIES, ATTACK_EFFECTS } from '../../../data/digimon-qualities';
import { Quality, QualityCategory } from '../../../core/models/digimon-quality';

@Component({
  selector: 'app-digimon-qualities-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digimon-qualities-selection.component.html',
  styleUrl: './digimon-qualities-selection.component.scss'
})
export class DigimonQualitiesSelectionComponent implements OnInit {
  digimon: DigimonCharacter | null = null;
  availableQualities: Quality[] = [];
  availableAttackEffects: Quality[] = [];
  selectedCategory: QualityCategory | 'All' = 'All';
  
  qualityCategories = [
    'All',
    ...Object.values(QualityCategory)
  ];

  constructor(
    private digimonService: DigimonService,
    private wizardService: DigimonCharacterWizardService
  ) {}

  ngOnInit(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
    this.loadAvailableQualities();
  }

  loadAvailableQualities(): void {
    if (!this.digimon) return;
    
    // Filter qualities based on stage requirements and prerequisites
    this.availableQualities = DIGIMON_QUALITIES.filter(quality => 
      this.isQualityAvailable(quality)
    );
    
    this.availableAttackEffects = ATTACK_EFFECTS.filter(effect => 
      this.isQualityAvailable(effect)
    );
  }

  isQualityAvailable(quality: Quality): boolean {
    if (!this.digimon) return false;
    
    // Check stage requirements
    if (quality.prerequisites) {
      for (const prereq of quality.prerequisites) {
        if (prereq.stageRequirement && this.getStageLevel(this.digimon.stage) < this.getStageLevel(prereq.stageRequirement)) {
          return false;
        }
        
        if (prereq.qualityId && !this.hasQuality(prereq.qualityId)) {
          return false;
        }
        
        if (prereq.statRequirement) {
          const statValue = this.digimon.stats[prereq.statRequirement.stat];
          if (statValue < prereq.statRequirement.minimum) {
            return false;
          }
        }
      }
    }
    
    // Check mutual exclusivity
    if (quality.mutuallyExclusive) {
      for (const exclusiveId of quality.mutuallyExclusive) {
        if (this.hasQuality(exclusiveId)) {
          return false;
        }
      }
    }
    
    return true;
  }

  getStageLevel(stage: string): number {
    const stageOrder = ['Fresh', 'In-Training', 'Rookie', 'Champion', 'Ultimate', 'Mega', 'Ultra'];
    return stageOrder.indexOf(stage);
  }

  hasQuality(qualityId: string): boolean {
    return this.digimon?.qualities.some(q => q.qualityId === qualityId) || false;
  }

  getQualityRank(qualityId: string): number {
    const quality = this.digimon?.qualities.find(q => q.qualityId === qualityId);
    return quality?.rank || 0;
  }

  canIncreaseQuality(quality: Quality): boolean {
    if (!this.digimon) return false;
    
    const currentRank = this.getQualityRank(quality.id);
    const maxRanks = quality.maxRanks || 1;
    const cost = quality.cost;
    
    return currentRank < maxRanks && this.digimon.remainingDP >= cost;
  }

  canDecreaseQuality(quality: Quality): boolean {
    return this.getQualityRank(quality.id) > 0;
  }

  increaseQuality(quality: Quality): void {
    if (!this.digimon || !this.canIncreaseQuality(quality)) return;
    
    const existingQuality = this.digimon.qualities.find(q => q.qualityId === quality.id);
    
    if (existingQuality) {
      existingQuality.rank++;
    } else {
      this.digimon.qualities.push({
        qualityId: quality.id,
        rank: 1
      });
    }
    
    this.updateDigimon();
  }

  decreaseQuality(quality: Quality): void {
    if (!this.digimon || !this.canDecreaseQuality(quality)) return;
    
    const existingQuality = this.digimon.qualities.find(q => q.qualityId === quality.id);
    
    if (existingQuality) {
      if (existingQuality.rank > 1) {
        existingQuality.rank--;
      } else {
        // Remove the quality entirely
        const index = this.digimon.qualities.indexOf(existingQuality);
        this.digimon.qualities.splice(index, 1);
      }
    }
    
    this.updateDigimon();
  }

  updateDigimon(): void {
    if (this.digimon) {
      this.digimonService.updateDigimon({
        qualities: [...this.digimon.qualities]
      });
      this.digimon = this.digimonService.getCurrentDigimon();
    }
  }

  getFilteredQualities(): Quality[] {
    const allQualities = [...this.availableQualities, ...this.availableAttackEffects];
    
    if (this.selectedCategory === 'All') {
      return allQualities;
    }
    
    return allQualities.filter(quality => quality.category === this.selectedCategory);
  }

  goBack(): void {
    this.wizardService.previousStep();
  }

  proceed(): void {
    this.wizardService.nextStep();
  }
}