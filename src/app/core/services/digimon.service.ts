// src/app/core/services/digimon.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { DigimonCharacter, DigimonAttribute, DigimonField, DigimonSize, DerivedDigimonStats } from '../models/digimon-character';
import { DigimonStats } from '../models/digimon-stat';
import { DIGIMON_STAGE_CONFIGS } from '../../data/digimon-stages';
import { DIGIMON_SIZE_CONFIGS } from '../../data/digimon-sizes';
import { DigimonStage } from '../models/digimon-stage';

export interface EvolutionLineSelection {
  rookieId: string;
  rookieName: string;
  rookieSprite?: string;
  championOptions: { id: string; name: string; sprite?: string }[];
  selectedChampion?: string;
  stages: DigimonStage[];
  hasSplitEvolution: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DigimonService {
  private initialDigimon: DigimonCharacter = {
    id: uuidv4(),
    name: '',
    species: '',
    stage: DigimonStage.Rookie,
    attribute: DigimonAttribute.Data,
    field: DigimonField.Unknown,
    size: DigimonSize.Medium,
    stats: {
      accuracy: 1,
      damage: 1,
      dodge: 1,
      armor: 1,
      health: 1
    },
    derivedStats: {
      brains: 0,
      body: 0,
      agility: 0,
      bitValue: 0,
      cpuValue: 0,
      ramValue: 0,
      woundBoxTotal: 0,
      movement: 0,
      range: 0,
      effectiveLimit: 0
    },
    qualities: [],
    attacks: [],
    remainingDP: 25,
    spentStatsDP: 5, // 1 point in each stat
    spentQualitiesDP: 0
  };

  private digimonSubject = new BehaviorSubject<DigimonCharacter>(this.initialDigimon);
  public digimon$: Observable<DigimonCharacter> = this.digimonSubject.asObservable();

  // Evolution line selection storage
  private evolutionLineSelection: EvolutionLineSelection | null = null;
  private evolutionLineSubject = new BehaviorSubject<EvolutionLineSelection | null>(null);
  public evolutionLine$: Observable<EvolutionLineSelection | null> = this.evolutionLineSubject.asObservable();

  constructor() {}

  getCurrentDigimon(): DigimonCharacter {
    return this.digimonSubject.getValue();
  }

  updateDigimon(updatedDigimon: Partial<DigimonCharacter>): void {
    const currentDigimon = this.digimonSubject.getValue();
    const newDigimon = { ...currentDigimon, ...updatedDigimon };
    
    // Recalculate derived stats if stats have changed
    if (updatedDigimon.stats || updatedDigimon.stage || updatedDigimon.size) {
      newDigimon.derivedStats = this.calculateDerivedStats(newDigimon);
    }
    
    // Update DP allocation if needed
    if (updatedDigimon.stats || updatedDigimon.qualities) {
      this.updateDPAllocation(newDigimon);
    }
    
    this.digimonSubject.next(newDigimon);
  }

  setStage(stage: DigimonStage): void {
    const currentDigimon = this.digimonSubject.getValue();
    const stageConfig = DIGIMON_STAGE_CONFIGS.find(s => s.stage === stage);
    
    if (!stageConfig) return;
    
    // Preserve important data from current digimon
    const preservedData = {
      profileImage: currentDigimon.profileImage,
      species: currentDigimon.species,
      name: currentDigimon.name,
      description: currentDigimon.description,
      evolutionLineId: currentDigimon.evolutionLineId,
      currentStageInLine: currentDigimon.currentStageInLine
    };
    
    // Reset stats to minimum for new stage
    const newStats: DigimonStats = {
      accuracy: 1,
      damage: 1,
      dodge: 1,
      armor: 1,
      health: 1
    };
    
    const updatedDigimon: DigimonCharacter = {
      ...currentDigimon, // Start with current digimon
      ...preservedData,  // Apply preserved data
      stage,
      stats: newStats,
      remainingDP: stageConfig.startingDP,
      spentStatsDP: 5, // 1 point in each stat
      spentQualitiesDP: 0,
      qualities: [], // Reset qualities for new stage
      attacks: []
    };
    
    updatedDigimon.derivedStats = this.calculateDerivedStats(updatedDigimon);
    this.digimonSubject.next(updatedDigimon);
  }

  calculateDerivedStats(digimon: DigimonCharacter): DerivedDigimonStats {
    const stageConfig = DIGIMON_STAGE_CONFIGS.find(s => s.stage === digimon.stage);
    const sizeConfig = DIGIMON_SIZE_CONFIGS.find(s => s.size === digimon.size);
    
    if (!stageConfig || !sizeConfig) {
      throw new Error('Invalid stage or size configuration');
    }

    // Base calculations
    const brains = Math.floor(digimon.stats.accuracy / 2) + stageConfig.brains;
    const body = Math.floor((digimon.stats.health + digimon.stats.damage + digimon.stats.armor) / 3) + sizeConfig.bodyModifier;
    const agility = Math.floor((digimon.stats.accuracy + digimon.stats.dodge) / 2) + sizeConfig.agilityModifier;

    // Spec Values (always round down)
    const bitValue = Math.floor(brains / 10) + stageConfig.specValues;
    const cpuValue = Math.floor(body / 10) + stageConfig.specValues;
    const ramValue = Math.floor(agility / 10) + stageConfig.specValues;

    // Other derived stats
    const woundBoxTotal = digimon.stats.health + stageConfig.woundBoxes;
    const movement = stageConfig.baseMovement;
    const range = Math.floor((digimon.stats.accuracy + brains) / 2) + bitValue;
    const effectiveLimit = Math.floor(digimon.stats.accuracy / 2) + brains + bitValue;

    return {
      brains: Math.max(0, brains),
      body: Math.max(0, body),
      agility: Math.max(0, agility),
      bitValue: Math.max(0, bitValue),
      cpuValue: Math.max(0, cpuValue),
      ramValue: Math.max(0, ramValue),
      woundBoxTotal,
      movement,
      range,
      effectiveLimit
    };
  }

  private updateDPAllocation(digimon: DigimonCharacter): void {
    // Calculate spent DP on stats (minimum 1 in each stat = 5 DP base)
    const statsTotal = digimon.stats.accuracy + digimon.stats.damage + digimon.stats.dodge + 
                      digimon.stats.armor + digimon.stats.health;
    digimon.spentStatsDP = statsTotal;

    // Calculate spent DP on qualities
    digimon.spentQualitiesDP = digimon.qualities.reduce((total, quality) => {
      // In a real implementation, you'd look up the quality cost from DIGIMON_QUALITIES
      // For now, assume each rank costs 1 DP (this would need to be more sophisticated)
      return total + quality.rank;
    }, 0);

    // Calculate remaining DP
    const stageConfig = DIGIMON_STAGE_CONFIGS.find(s => s.stage === digimon.stage);
    if (stageConfig) {
      digimon.remainingDP = stageConfig.startingDP - digimon.spentStatsDP - digimon.spentQualitiesDP;
    }
  }

  // Evolution Line Methods
  setEvolutionLineSelection(selection: EvolutionLineSelection): void {
    this.evolutionLineSelection = selection;
    this.evolutionLineSubject.next(selection);
    
    // Store in localStorage for persistence
    localStorage.setItem('digimonEvolutionLine', JSON.stringify(selection));
  }

  getEvolutionLineSelection(): EvolutionLineSelection | null {
    return this.evolutionLineSelection;
  }

  loadEvolutionLineSelection(): boolean {
    const saved = localStorage.getItem('digimonEvolutionLine');
    if (saved) {
      try {
        this.evolutionLineSelection = JSON.parse(saved);
        this.evolutionLineSubject.next(this.evolutionLineSelection);
        return true;
      } catch (error) {
        console.error('Failed to load evolution line selection:', error);
      }
    }
    return false;
  }

  clearEvolutionLineSelection(): void {
    this.evolutionLineSelection = null;
    this.evolutionLineSubject.next(null);
    localStorage.removeItem('digimonEvolutionLine');
  }

  resetDigimon(): void {
    const newDigimon = { ...this.initialDigimon, id: uuidv4() };
    newDigimon.derivedStats = this.calculateDerivedStats(newDigimon);
    this.digimonSubject.next(newDigimon);
    this.clearEvolutionLineSelection();
  }

  saveDigimon(): void {
    const digimon = this.digimonSubject.getValue();
    localStorage.setItem('savedDigimon', JSON.stringify(digimon));
  }

  loadDigimon(): boolean {
    const savedDigimon = localStorage.getItem('savedDigimon');
    if (savedDigimon) {
      const digimon = JSON.parse(savedDigimon);
      digimon.derivedStats = this.calculateDerivedStats(digimon);
      this.digimonSubject.next(digimon);
      return true;
    }
    return false;
  }

  // Validation methods
  validateDigimon(digimon: DigimonCharacter): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!digimon.name.trim()) {
      errors.push('Digimon name is required');
    }

    if (!digimon.species.trim()) {
      errors.push('Digimon species is required');
    }

    // Check minimum stats (must have at least 1 in each)
    if (digimon.stats.accuracy < 1 || digimon.stats.damage < 1 || digimon.stats.dodge < 1 || 
        digimon.stats.armor < 1 || digimon.stats.health < 1) {
      errors.push('All stats must have at least 1 point');
    }

    // Check DP allocation
    if (digimon.remainingDP < 0) {
      errors.push('Cannot exceed available DP');
    }

    // Must have at least the minimum required attacks for stage
    const stageConfig = DIGIMON_STAGE_CONFIGS.find(s => s.stage === digimon.stage);
    if (stageConfig && digimon.attacks.length < stageConfig.attacks) {
      errors.push(`Must have at least ${stageConfig.attacks} attacks for ${digimon.stage} stage`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Utility methods
  getStageConfig(stage: DigimonStage) {
    return DIGIMON_STAGE_CONFIGS.find(s => s.stage === stage);
  }

  getSizeConfig(size: DigimonSize) {
    return DIGIMON_SIZE_CONFIGS.find(s => s.size === size);
  }

  getAvailableStages(): DigimonStage[] {
    return Object.values(DigimonStage);
  }

  getAvailableAttributes(): DigimonAttribute[] {
    return Object.values(DigimonAttribute);
  }

  getAvailableFields(): DigimonField[] {
    return Object.values(DigimonField);
  }

  getAvailableSizes(): DigimonSize[] {
    return Object.values(DigimonSize);
  }
}