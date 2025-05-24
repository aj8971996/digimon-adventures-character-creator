// src/app/features/digimon-character/digimon-stats-allocation/digimon-stats-allocation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacter } from '../../../core/models/digimon-character';
import { DigimonStats } from '../../../core/models/digimon-stat';

@Component({
  selector: 'app-digimon-stats-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digimon-stats-allocation.component.html',
  styleUrl: './digimon-stats-allocation.component.scss'
})
export class DigimonStatsAllocationComponent implements OnInit {
  digimon: DigimonCharacter | null = null;
  
  statInfo = [
    {
      id: 'accuracy' as keyof DigimonStats,
      name: 'Accuracy',
      description: 'Determines how intelligent the Digimon is, how many dice are rolled when it tries to Attack, the effectiveness of its Negative Effect tags, Range, and the size of its Area Attacks.'
    },
    {
      id: 'damage' as keyof DigimonStats,
      name: 'Damage', 
      description: 'Directly affects how hard a Digimon hits with all of its Attacks. Damage also helps scale the Body stat.'
    },
    {
      id: 'dodge' as keyof DigimonStats,
      name: 'Dodge',
      description: 'Determines how many dice are rolled in response to the Digimon being attacked, and is paired with Accuracy to determine the Digimon\'s Agility stat.'
    },
    {
      id: 'armor' as keyof DigimonStats,
      name: 'Armor',
      description: 'Defensive counterpart to Damage; Armor will directly reduce how much a Digimon is hurt by an attack. Armor also influences the Body stat.'
    },
    {
      id: 'health' as keyof DigimonStats,
      name: 'Health',
      description: 'Helps to determine how many Wound Boxes a Digimon has, as well as how many dice it rolls to recover Wound Boxes after Combat. Health also affects the Body stat.'
    }
  ];

  constructor(private digimonService: DigimonService) {}

  ngOnInit(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
  }

  increaseStat(statId: keyof DigimonStats): void {
    if (!this.digimon || this.digimon.remainingDP <= 0) return;
    
    this.digimon.stats[statId]++;
    this.updateDigimon();
  }

  decreaseStat(statId: keyof DigimonStats): void {
    if (!this.digimon || this.digimon.stats[statId] <= 1) return;
    
    this.digimon.stats[statId]--;
    this.updateDigimon();
  }

  updateDigimon(): void {
    if (this.digimon) {
      this.digimonService.updateDigimon({
        stats: { ...this.digimon.stats }
      });
      // Refresh the digimon object to get updated DP values
      this.digimon = this.digimonService.getCurrentDigimon();
    }
  }

  getStatValue(statId: keyof DigimonStats): number {
    return this.digimon?.stats[statId] || 1;
  }

  canDecrease(statId: keyof DigimonStats): boolean {
    return this.getStatValue(statId) > 1;
  }

  canIncrease(): boolean {
    return (this.digimon?.remainingDP || 0) > 0;
  }

  getTotalStatsSpent(): number {
    if (!this.digimon) return 0;
    return Object.values(this.digimon.stats).reduce((sum, value) => sum + value, 0);
  }

  getStageConfig() {
    if (!this.digimon) return null;
    return this.digimonService.getStageConfig(this.digimon.stage);
  }
}