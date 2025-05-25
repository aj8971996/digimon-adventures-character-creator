// src/app/core/services/evolution-line-manager.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DigimonCharacter } from '../models/digimon-character';
import { DigimonStage } from '../models/digimon-stage';

export interface EvolutionLineData {
  id: string;
  rookieId: string;
  rookieName: string;
  rookieSprite?: string;
  selectedStages: DigimonStage[];
  selectedChampions: string[]; // Multiple champions for split evolution
  championOptions: { id: string; name: string; sprite?: string; isPrimary?: boolean }[];
  isSplitEvolution: boolean;
  createdCharacters: Map<string, DigimonCharacter>; // stage-evolutionId -> character
  currentEditingStage: DigimonStage;
  currentEditingEvolutionId?: string; // For split evolutions
}

@Injectable({
  providedIn: 'root'
})
export class EvolutionLineManagerService {
  private evolutionLineSubject = new BehaviorSubject<EvolutionLineData | null>(null);
  public evolutionLine$ = this.evolutionLineSubject.asObservable();

  constructor() {}

  /**
   * Initialize a new evolution line
   */
  initializeEvolutionLine(data: {
    rookieId: string;
    rookieName: string;
    rookieSprite?: string;
    selectedStages: DigimonStage[];
    selectedChampions: string[];
    championOptions: { id: string; name: string; sprite?: string; isPrimary?: boolean }[];
  }): void {
    const evolutionLine: EvolutionLineData = {
      id: this.generateId(),
      ...data,
      isSplitEvolution: data.selectedChampions.length > 1,
      createdCharacters: new Map(),
      currentEditingStage: DigimonStage.Rookie,
      currentEditingEvolutionId: undefined
    };

    this.evolutionLineSubject.next(evolutionLine);
    this.saveToStorage();
  }

  /**
   * Get current evolution line
   */
  getCurrentEvolutionLine(): EvolutionLineData | null {
    return this.evolutionLineSubject.getValue();
  }

  /**
   * Set the current stage and evolution being edited
   */
  setCurrentEditing(stage: DigimonStage, evolutionId?: string): void {
    const current = this.getCurrentEvolutionLine();
    if (current) {
      current.currentEditingStage = stage;
      current.currentEditingEvolutionId = evolutionId;
      this.evolutionLineSubject.next(current);
      this.saveToStorage();
    }
  }

  /**
   * Save a character for a specific stage and evolution path
   */
  saveCharacterForStage(stage: DigimonStage, character: DigimonCharacter, evolutionId?: string): void {
    const current = this.getCurrentEvolutionLine();
    if (!current) return;

    const key = this.getCharacterKey(stage, evolutionId);
    current.createdCharacters.set(key, character);
    this.evolutionLineSubject.next(current);
    this.saveToStorage();
  }

  /**
   * Get character for specific stage and evolution path
   */
  getCharacterForStage(stage: DigimonStage, evolutionId?: string): DigimonCharacter | null {
    const current = this.getCurrentEvolutionLine();
    if (!current) return null;

    const key = this.getCharacterKey(stage, evolutionId);
    return current.createdCharacters.get(key) || null;
  }

  /**
   * Get all created characters
   */
  getAllCreatedCharacters(): DigimonCharacter[] {
    const current = this.getCurrentEvolutionLine();
    if (!current) return [];

    return Array.from(current.createdCharacters.values());
  }

  /**
   * Get next stage/evolution to create
   */
  getNextToCreate(): { stage: DigimonStage; evolutionId?: string } | null {
    const current = this.getCurrentEvolutionLine();
    if (!current) return null;

    // Always start with Rookie
    if (!current.createdCharacters.has(this.getCharacterKey(DigimonStage.Rookie))) {
      return { stage: DigimonStage.Rookie };
    }

    // Then handle Champions based on split evolution
    if (current.selectedStages.includes(DigimonStage.Champion)) {
      for (const championId of current.selectedChampions) {
        const key = this.getCharacterKey(DigimonStage.Champion, championId);
        if (!current.createdCharacters.has(key)) {
          return { stage: DigimonStage.Champion, evolutionId: championId };
        }
      }
    }

    // Handle other stages (Ultimate, Mega) - for now, just check if they exist
    // In a full implementation, you'd handle split evolutions for these too
    for (const stage of current.selectedStages) {
      if (stage !== DigimonStage.Rookie && stage !== DigimonStage.Champion) {
        if (!current.createdCharacters.has(this.getCharacterKey(stage))) {
          return { stage };
        }
      }
    }

    return null; // All characters created
  }

  /**
   * Check if evolution line is complete
   */
  isEvolutionLineComplete(): boolean {
    return this.getNextToCreate() === null;
  }

  /**
   * Get creation progress
   */
  getCreationProgress(): { completed: number; total: number; percentage: number } {
    const current = this.getCurrentEvolutionLine();
    if (!current) return { completed: 0, total: 0, percentage: 0 };

    let total = current.selectedStages.length;
    
    // If split evolution for Champion, count each champion separately
    if (current.selectedStages.includes(DigimonStage.Champion)) {
      total = total - 1 + current.selectedChampions.length;
    }

    const completed = current.createdCharacters.size;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }

  /**
   * Reset evolution line
   */
  resetEvolutionLine(): void {
    this.evolutionLineSubject.next(null);
    this.clearStorage();
  }

  /**
   * Load from storage
   */
  loadFromStorage(): boolean {
    const saved = localStorage.getItem('evolutionLineData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Convert the plain object back to Map
        data.createdCharacters = new Map(Object.entries(data.createdCharacters || {}));
        this.evolutionLineSubject.next(data);
        return true;
      } catch (error) {
        console.error('Failed to load evolution line data:', error);
      }
    }
    return false;
  }

  /**
   * Save to storage
   */
  private saveToStorage(): void {
    const current = this.getCurrentEvolutionLine();
    if (current) {
      // Convert Map to plain object for JSON storage
      const dataToSave = {
        ...current,
        createdCharacters: Object.fromEntries(current.createdCharacters)
      };
      localStorage.setItem('evolutionLineData', JSON.stringify(dataToSave));
    }
  }

  /**
   * Clear storage
   */
  private clearStorage(): void {
    localStorage.removeItem('evolutionLineData');
  }

  /**
   * Generate character key for storage
   */
  private getCharacterKey(stage: DigimonStage, evolutionId?: string): string {
    return evolutionId ? `${stage}-${evolutionId}` : stage;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return 'evolution_' + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Get champion name by ID
   */
  getChampionNameById(championId: string): string {
    const current = this.getCurrentEvolutionLine();
    if (!current) return '';
    
    const champion = current.championOptions.find(c => c.id === championId);
    return champion ? champion.name : '';
  }

  /**
   * Get evolution line summary for display
   */
  getEvolutionSummary(): {
    rookieName: string;
    stages: { stage: DigimonStage; names: string[] }[];
    isComplete: boolean;
    progress: { completed: number; total: number; percentage: number };
  } {
    const current = this.getCurrentEvolutionLine();
    if (!current) {
      return {
        rookieName: '',
        stages: [],
        isComplete: false,
        progress: { completed: 0, total: 0, percentage: 0 }
      };
    }

    const stages: { stage: DigimonStage; names: string[] }[] = [];
    
    // Always include Rookie
    stages.push({
      stage: DigimonStage.Rookie,
      names: [current.rookieName]
    });

    // Handle Champions
    if (current.selectedStages.includes(DigimonStage.Champion)) {
      const championNames = current.selectedChampions.map(id => 
        this.getChampionNameById(id)
      ).filter(name => name);
      
      stages.push({
        stage: DigimonStage.Champion,
        names: championNames
      });
    }

    // Handle other stages (placeholder for future implementation)
    for (const stage of current.selectedStages) {
      if (stage !== DigimonStage.Rookie && stage !== DigimonStage.Champion) {
        stages.push({
          stage,
          names: ['TBD'] // To be determined based on champion choices
        });
      }
    }

    return {
      rookieName: current.rookieName,
      stages,
      isComplete: this.isEvolutionLineComplete(),
      progress: this.getCreationProgress()
    };
  }
}